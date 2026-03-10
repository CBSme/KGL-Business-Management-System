const router = require("express").Router();
const auth = require("../middleware/auth");
const Procurement = require("../models/Procurement");
const Stock = require("../models/Stock");


// Only Manager can record procurement
router.post("/", auth, async (req, res) => {
  try {
    if (req.user.role !== "Manager")
      return res.status(403).json({ error: "Only Managers can record procurement." });

    const data = { ...req.body, branch: req.user.branch, recordedBy: req.user.id };
    const procurement = await new Procurement(data).save();

    // Update stock
    let stock = await Stock.findOne({ produceName: data.produceName, branch: data.branch });
    if (stock) {
      stock.currentTonnage += Number(data.tonnageKg);
      stock.lastUpdated = new Date();
      await stock.save();
    } else {
      await Stock.create({
        produceName: data.produceName,
        branch: data.branch,
        currentTonnage: Number(data.tonnageKg),
      });
    }

    res.status(201).json({ message: "Procurement recorded. Stock updated.", procurement });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.get("/", auth, async (req, res) => {
  try {
    const filter = req.user.role === "Director" ? {} : { branch: req.user.branch };
    const records = await Procurement.find(filter)
      .populate("recordedBy", "fullName")
      .sort({ createdAt: -1 });
    res.json(records);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
