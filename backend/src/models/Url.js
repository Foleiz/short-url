import mongoose from "mongoose";

const UrlSchema = new mongoose.Schema(
  {
    Full_Url: { type: String, required: true },
Short_Url: { type: String, required: true, unique: true },
Click_Count: { type: Number, default: 0 },
Create_Date: { type: Date, default: Date.now },
Update_Date: { type: Date, default: Date.now }

  },
  {  timestamps: false,
  versionKey: false }
);

export default mongoose.model("Url", UrlSchema);
