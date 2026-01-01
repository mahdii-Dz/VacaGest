import mongoose from "mongoose";

const PdfSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
    required: true
  },

  category: {
    type: String,
    enum: ["pedagogical", "monthly", "administrative"],
    required: true
  },

  month: String, // only for monthly fiches

  gridfsId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },

  status: {
    type: String,
    enum: ["pending", "validated", "rejected"],
    default: "pending"
  },

  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model("PdfDocument", PdfSchema);
