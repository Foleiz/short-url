import express from "express";
import { nanoid } from "nanoid";
import Url from "../models/Url.js";

const router = express.Router();

// Create Short URL
router.post("/shorten", async (req, res) => {
  const shortCode = nanoid(6);

  const url = await Url.create({
    fullUrl: req.body.fullUrl,
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

export default router;
