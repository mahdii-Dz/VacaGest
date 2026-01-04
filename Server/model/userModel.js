import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    fName: {
      type: String,
      required: true,
      trim: true,
    },
    lName: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    phone: {
      type: Number,
      default: 0,
    },
    grade: {
      type: String,
      default: "",
    },
    specialty: {
      type: String,
      default: "",
    },
    statue: {
      type: String,
      default: "",
    },
    password: {
      type: String,
      required: true,
    },
    emailVerified: {
      type: Boolean,
      default: true,
    },
    hours:{
      type: Number,
      default: 0,
    }
  },
  { timestamps: true }
);

export default mongoose.model("users", userSchema);
