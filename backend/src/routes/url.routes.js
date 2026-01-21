import express from "express";
import { nanoid } from "nanoid";
import Url from "../models/Url.js";

const router = express.Router();

// Create Short URL
router.post("/shorten", async (req, res) => {
  const { fullUrl, customAlias } = req.body;
  let shortCode;

  if (customAlias && customAlias.trim()) {
    const exists = await Url.findOne({ shortCode: customAlias });
    if (exists) {
      return res.status(400).json({ error: "ชื่อย่อนี้ถูกใช้งานแล้ว กรุณาใช้ชื่ออื่น" });
    }
    shortCode = customAlias;
  } else {
    shortCode = nanoid(6);
  }

  const url = await Url.create({
    fullUrl,
    shortCode,
  });

  res.json({
    shortUrl: `http://localhost:5000/${shortCode}`,
  });
});

// Get history
router.get("/urls", async (req, res) => {
  const urls = await Url.find().sort({ createdAt: -1 });
  res.json(
    urls.map((u) => ({
      ...u.toObject(),
      shortUrl: `http://localhost:5000/${u.shortCode}`,
    }))
  );
});

// Redirect
router.get("/:code", async (req, res) => {
  const url = await Url.findOne({ shortCode: req.params.code });
  if (!url) return res.sendStatus(404);

  url.clickCount++;
  await url.save();

  res.redirect(url.fullUrl);
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
  const { fullUrl, shortCode } = req.body;
  try {
    const url = await Url.findById(req.params.id);
    if (!url) return res.status(404).json({ error: "URL not found" });

    if (shortCode && shortCode !== url.shortCode) {
      const exists = await Url.findOne({ shortCode });
      if (exists) return res.status(400).json({ error: "ชื่อย่อนี้ถูกใช้งานแล้ว" });
      url.shortCode = shortCode;
    }
    if (fullUrl) url.fullUrl = fullUrl;

    await url.save();
    res.json(url);
  } catch (error) {
    res.status(500).json({ error: "Error updating URL" });
  }
});

export default router;
