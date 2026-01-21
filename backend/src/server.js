import mongoose from "mongoose";
import app from "./app.js";

mongoose.connect("mongodb://127.0.0.1:27017/shorturl");

app.listen(5000, () => {
  console.log("Server running on http://localhost:5000");
});
