const express = require("express");
const Plant = require("../models/Plant");
const router = express.Router();

// 🔹 Create a new plant
router.post("/", async (req, res) => {
  try {
    const { name, type, wateringFrequency, lastWateredAt } = req.body;
    const newPlant = new Plant({
      name,
      type,
      wateringFrequency,
      lastWateredAt: lastWateredAt || Date.now(), // default to now if not provided
    });
    await newPlant.save();
    res.status(201).json(newPlant);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 🔹 Get all plants
router.get("/", async (req, res) => {
  try {
    const plants = await Plant.find();
    res.json(plants);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 🔹 Update plant (generic)
router.put("/:id", async (req, res) => {
  try {
    const updatedPlant = await Plant.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedPlant) return res.status(404).json({ error: "Plant not found" });
    res.json(updatedPlant);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 🔹 Water plant (update lastWateredAt to today)
router.put("/water/:id", async (req, res) => {
  try {
    const today = new Date();
    const wateredPlant = await Plant.findByIdAndUpdate(
      req.params.id,
      { lastWateredAt: today },
      { new: true }
    );
    if (!wateredPlant) return res.status(404).json({ error: "Plant not found" });
    res.json(wateredPlant);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 🔹 Delete plant
router.delete("/:id", async (req, res) => {
  try {
    await Plant.findByIdAndDelete(req.params.id);
    res.json({ message: "Plant deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
