import mongoose from "mongoose";

const UrlSchema = new mongoose.Schema(
  {
    fullUrl: { type: String, required: true },
    shortCode: { type: String, required: true, unique: true },
    clickCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.model("Url", UrlSchema);
