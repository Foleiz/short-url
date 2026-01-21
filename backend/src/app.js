import express from "express";
import cors from "cors";
import urlRoutes from "./routes/url.routes.js";

const app = express();

app.use(cors());
app.use(express.json());

// เรียกใช้ Routes ที่ path หลัก เพื่อให้ตรงกับ Frontend (เช่น /shorten, /urls)
app.use("/", urlRoutes);
app.use("/api", urlRoutes);

export default app;
