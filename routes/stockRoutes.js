const router = require("express").Router();
const auth = require("../middleware/auth");
const Stock = require("../models/Stock");
const Notification = require("../models/Notification");

router.get("/", auth, async (req, res) => {
  try {
    const filter = req.user.role === "Director" ? {} : { branch: req.user.branch };
    const stocks = await Stock.find(filter).sort({ produceName: 1 });
    res.json(stocks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/notifications", auth, async (req, res) => {
  try {
    const filter = req.user.role === "Director" ? {} : { branch: req.user.branch };
    const notifs = await Notification.find({ ...filter, isRead: false }).sort({ createdAt: -1 });
    res.json(notifs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.patch("/notifications/:id/read", auth, async (req, res) => {
  try {
    await Notification.findByIdAndUpdate(req.params.id, { isRead: true });
    res.json({ message: "Notification marked as read." });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
