// routes/fileRoute.js
import express from "express";
import {
  uploadFile,
  listFiles,
  downloadFile,
  updateFileStatus,
} from "../controller/fileController.js";
import { uploadSingle } from "../middleware/upload.js";

const router = express.Router();

// POST /api/files/upload — Upload PDF with metadata
router.post("/upload", uploadSingle, uploadFile);

// GET /api/files — List filtered PDFs
router.get("/", listFiles);

// GET /api/files/:filename — Download by filename
router.get("/:filename", downloadFile);

// PATCH /api/files/:fileId — Update status (e.g., validate/reject)
router.patch("/:fileId", updateFileStatus);

export default router;