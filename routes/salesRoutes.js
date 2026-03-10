const router = require("express").Router();
const auth = require("../middleware/auth");
const Sales = require("../models/Sales");
const Stock = require("../models/Stock");
const Notification = require("../models/Notification");

router.post("/", auth, async (req, res) => {
  try {
    if (req.user.role === "Director")
      return res.status(403).json({ error: "Directors cannot record sales." });

    const { produceName, tonnageSoldKg } = req.body;
    const useBranch = req.user.role === "Manager" ? req.user.branch : req.user.branch;

    // Check stock
    const stock = await Stock.findOne({ produceName, branch: useBranch });
    if (!stock || stock.currentTonnage < tonnageSoldKg)
      return res
        .status(400)
        .json({
          error: `Not enough stock! Available: ${stock ? stock.currentTonnage : 0} kg of ${produceName}.`,
        });

    const sale = await new Sales({
      ...req.body,
      branch: useBranch,
      recordedBy: req.user.id,
    }).save();

    // Deduct stock
    stock.currentTonnage -= Number(tonnageSoldKg);
    stock.lastUpdated = new Date();
    await stock.save();

    // Notify if zero or low stock
    if (stock.currentTonnage === 0) {
      await Notification.create({
        message: `⚠️ ALERT: ${produceName} is OUT OF STOCK at ${useBranch} branch!`,
        branch: useBranch,
        produceName,
        type: "zero_stock",
      });
    } else if (stock.currentTonnage < 500) {
      await Notification.create({
        message: `⚠️ LOW STOCK: ${produceName} is low (${stock.currentTonnage} kg) at ${useBranch}.`,
        branch: useBranch,
        produceName,
        type: "low_stock",
      });
    }

    res
      .status(201)
      .json({ message: "Sale recorded successfully!", sale, remainingStock: stock.currentTonnage });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.get("/", auth, async (req, res) => {
  try {
    const filter = req.user.role === "Director" ? {} : { branch: req.user.branch };
    const sales = await Sales.find(filter)
      .populate("recordedBy", "fullName")
      .sort({ createdAt: -1 });
    res.json(sales);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
