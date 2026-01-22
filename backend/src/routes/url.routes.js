import express from "express";
import { nanoid } from "nanoid";
import Url from "../models/Url.js";

const router = express.Router();

// Create Short URL
router.post("/shorten", async (req, res) => {
  try {
    // รองรับทั้ง Full_Url (ใหม่) และ fullUrl (เก่า) เพื่อป้องกันปัญหา
    const { Full_Url, fullUrl, customAlias } = req.body;
    const finalFullUrl = Full_Url || fullUrl;

    if (!finalFullUrl) {
      return res.status(400).json({ error: "กรุณาระบุลิงก์ปลายทาง (Full_Url)" });
    }

    // ถ้ามี customAlias ให้ใช้เลย ถ้าไม่มีให้สุ่มใหม่
    let Short_Url = customAlias && customAlias.trim() ? customAlias : nanoid(6);

    if (customAlias) {
      const exists = await Url.findOne({ Short_Url });
      if (exists) {
        return res.status(400).json({ error: "ชื่อย่อนี้ถูกใช้งานแล้ว" });
      }
    }

    const url = await Url.create({
      Full_Url: finalFullUrl,
      Short_Url
    });

    res.json({
      shortUrl: `https://short-url-515v.onrender.com/${Short_Url}`,
    });
  } catch (error) {
    console.error("Error creating short URL:", error);
    res.status(500).json({ error: "เกิดข้อผิดพลาดที่ Server: " + error.message });
  }
});

// Get history
router.get("/urls", async (req, res) => {
  const urls = await Url.find().sort({ Create_Date: -1 });
  res.json(
    urls.map((u) => ({
      ...u.toObject(),
      shortUrl: `https://short-url-515v.onrender.com/${u.Short_Url}`,
    }))
  );
});

// Redirect
router.get("/:code", async (req, res) => {
  const url = await Url.findOne({ Short_Url: req.params.code });
  if (!url) return res.sendStatus(404);

  url.Click_Count++;
  await url.save();

  res.redirect(url.Full_Url);
});

// Delete URL
router.delete("/urls/:id", async (req, res) => {
  try {
    await Url.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Error deleting URL" });
  }
});

// Update URL
router.put("/urls/:id", async (req, res) => {
  const { Full_Url, Short_Url } = req.body;

  try {
    const url = await Url.findById(req.params.id);
    if (!url) return res.status(404).json({ error: "URL not found" });

    // ถ้ามีการเปลี่ยนชื่อย่อ ต้องเช็คว่าซ้ำไหม
    if (Short_Url && Short_Url !== url.Short_Url) {
      const exists = await Url.findOne({ Short_Url });
      if (exists) return res.status(400).json({ error: "ชื่อย่อนี้ถูกใช้งานแล้ว" });
      url.Short_Url = Short_Url;
    }
    if (Full_Url) url.Full_Url = Full_Url;

    url.Update_Date = new Date();
    await url.save();
    res.json(url);
  } catch (error) {
    res.status(500).json({ error: "Error updating URL" });
  }
});

export default router;
