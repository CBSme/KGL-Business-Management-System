const router = require("express").Router();
const auth = require("../middleware/auth");
const Credit = require("../models/CreditSales");
const Stock = require("../models/Stock");
const Notification = require("../models/Notification");

router.post("/", auth, async (req, res) => {
  try {
    if (req.user.role === "Director")
      return res.status(403).json({ error: "Directors cannot record credit sales." });

    const { produceName, tonnageKg } = req.body;
    const branch = req.user.branch;

    const stock = await Stock.findOne({ produceName, branch });
    if (!stock || stock.currentTonnage < tonnageKg)
      return res
        .status(400)
        .json({ error: `Not enough stock! Available: ${stock ? stock.currentTonnage : 0} kg.` });

    const credit = await new Credit({ ...req.body, branch, recordedBy: req.user.id }).save();

    stock.currentTonnage -= Number(tonnageKg);
    stock.lastUpdated = new Date();
    await stock.save();

    if (stock.currentTonnage === 0) {
      await Notification.create({
        message: `⚠️ ALERT: ${produceName} is OUT OF STOCK at ${branch} branch!`,
        branch,
        produceName,
        type: "zero_stock",
      });
    } else if (stock.currentTonnage < 500) {
      await Notification.create({
        message: `⚠️ LOW STOCK: ${produceName} is low (${stock.currentTonnage} kg) at ${branch}.`,
        branch,
        produceName,
        type: "low_stock",
      });
    }

    res
      .status(201)
      .json({ message: "Credit sale recorded!", credit, remainingStock: stock.currentTonnage });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.get("/", auth, async (req, res) => {
  try {
    const filter = req.user.role === "Director" ? {} : { branch: req.user.branch };
    const credits = await Credit.find(filter)
      .populate("recordedBy", "fullName")
      .sort({ createdAt: -1 });
    res.json(credits);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Mark credit as paid
router.patch("/:id/pay", auth, async (req, res) => {
  try {
    if (req.user.role === "Sales Agent")
      return res
        .status(403)
        .json({ error: "Only Managers and Directors can mark credits as paid." });

    const credit = await Credit.findByIdAndUpdate(req.params.id, { isPaid: true }, { new: true });

    res.json({ message: "Marked as paid!", credit });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
