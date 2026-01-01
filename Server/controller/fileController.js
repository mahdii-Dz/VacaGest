import mongoose from "mongoose";
import User from "../model/userModel.js";
import gridfs from "../config/gridfs.js";

// Upload PDF with metadata
export const uploadFile = async (req, res) => {
  try {
    const bucket = gridfs();
    if (!bucket) {
      return res.status(503).json({ error: "GridFS not ready" });
    }

    if (!req.file || req.file.mimetype !== "application/pdf") {
      return res.status(400).json({ error: "PDF file required" });
    }

    const {
      vacataireId,
      type, // "pedagogique" | "mensuelle"
      month,
      year,
      status = "pending",
    } = req.body;

    // Validate vacataireId format
    if (!vacataireId || !mongoose.Types.ObjectId.isValid(vacataireId)) {
      return res.status(400).json({ error: "Invalid vacataireId format" });
    }

    // Check if vacataire exists
    const userExists = await User.exists({ _id: vacataireId });
    if (!userExists) {
      return res.status(404).json({ error: "Vacataire not found" });
    }

    // Validate type
    if (!["pedagogique", "mensuelle"].includes(type)) {
      return res
        .status(400)
        .json({ error: "Invalid type. Must be 'pedagogique' or 'mensuelle'" });
    }

    // For mensuelle, month and year are required
    if (type === "mensuelle") {
      if (!month || !year) {
        return res
          .status(400)
          .json({
            error: "Month and year are required for monthly declarations",
          });
      }
    }

    const filename = `${Date.now()}-${req.file.originalname}`;
    const metadata = {
      vacataireId,
      type,
      status,
      uploadedAt: new Date(),
    };

    if (type === "mensuelle") {
      metadata.month = parseInt(month, 10);
      metadata.year = parseInt(year, 10);
    }

    const stream = bucket.openUploadStream(filename, {
      contentType: "application/pdf",
      metadata,
    });

    stream.end(req.file.buffer);

    stream.on("finish", () => {
      res.status(201).json({
        success: true,
        file: {
          id: stream.id.toString(),
          filename: stream.filename,
          metadata: stream.metadata,
        },
      });
    });

    stream.on("error", (err) => {
      console.error("GridFS upload error:", err);
      res.status(500).json({ error: "Failed to store file" });
    });
  } catch (err) {
    console.error("Upload controller error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

// List files with optional filters
export const listFiles = async (req, res) => {
  try {
    const bucket = gridfs();
    if (!bucket) {
      return res.status(503).json({ error: "GridFS not ready" });
    }

    const { vacataireId, type, status } = req.query;
    const filter = {};

    if (vacataireId) {
      if (!mongoose.Types.ObjectId.isValid(vacataireId)) {
        return res.status(400).json({ error: "Invalid vacataireId format" });
      }
      filter["metadata.vacataireId"] = vacataireId;
    }

    if (type) {
      if (!["pedagogique", "mensuelle"].includes(type)) {
        return res.status(400).json({ error: "Invalid type filter" });
      }
      filter["metadata.type"] = type;
    }

    if (status) {
      if (!["pending", "validated", "rejected"].includes(status)) {
        return res.status(400).json({ error: "Invalid status filter" });
      }
      filter["metadata.status"] = status;
    }

    const files = await bucket.find(filter).toArray();
    res.json(files);
  } catch (err) {
    console.error("List files error:", err);
    res.status(500).json({ error: "Failed to retrieve files" });
  }
};

// Download file by filename
export const downloadFile = async (req, res) => {
  try {
    const bucket = gridfs();
    if (!bucket) {
      return res.status(503).json({ error: "GridFS not ready" });
    }

    const { filename } = req.params;
    const files = await bucket.find({ filename }).toArray();

    if (files.length === 0) {
      return res.status(404).json({ error: "File not found" });
    }

    const file = files[0];
    res.set({
      "Content-Type": "application/pdf",
      "Content-Disposition": `inline; filename="${file.filename}"`,
    });

    bucket.openDownloadStream(file._id).pipe(res);
  } catch (err) {
    console.error("Download error:", err);
    res.status(500).json({ error: "Failed to download file" });
  }
};

// Update file status (for validation workflow)
export const updateFileStatus = async (req, res) => {
  try {
    const { fileId } = req.params;
    const { status, validatedBy } = req.body;

    if (!mongoose.Types.ObjectId.isValid(fileId)) {
      return res.status(400).json({ error: "Invalid fileId" });
    }

    if (!["pending", "validated", "rejected"].includes(status)) {
      return res
        .status(400)
        .json({
          error:
            "Invalid status. Must be 'pending', 'validated', or 'rejected'",
        });
    }

    const result = await mongoose.connection.db
      .collection("pdfs.files")
      .updateOne(
        { _id: new mongoose.Types.ObjectId(fileId) },
        {
          $set: {
            "metadata.status": status,
            "metadata.validatedBy": validatedBy,
            "metadata.validatedAt": new Date(),
          },
        }
      );

    if (result.matchedCount === 0) {
      return res.status(404).json({ error: "File not found" });
    }

    res.json({ success: true, message: "Status updated successfully" });
  } catch (err) {
    console.error("Update status error:", err);
    res.status(500).json({ error: "Failed to update file status" });
  }
};
