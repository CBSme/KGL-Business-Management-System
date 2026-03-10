const router = require("express").Router();
const auth = require("../middleware/auth");
const Sales = require("../models/Sales");
const Credit = require("../models/CreditSales");
const Stock = require("../models/Stock");
const Procurement = require("../models/Procurement");

router.get("/summary", auth, async (req, res) => {
  try {
    const branchFilter = req.user.role === "Director" ? {} : { branch: req.user.branch };

    if (req.user.role === "Sales Agent") return res.status(403).json({ error: "Access denied." });

    const [sales, credits, stocks, procurements] = await Promise.all([
      Sales.find(branchFilter),
      Credit.find(branchFilter),
      Stock.find(branchFilter),
      Procurement.find(branchFilter),
    ]);

    const totalSalesAmount = sales.reduce((s, r) => s + r.amountPaidUGX, 0);
    const totalSalesTonnage = sales.reduce((s, r) => s + r.tonnageSoldKg, 0);
    const totalCreditAmount = credits.reduce((s, r) => s + r.amountDueUGX, 0);
    const unpaidCredit = credits.filter((c) => !c.isPaid).reduce((s, r) => s + r.amountDueUGX, 0);
    const totalProcurementCost = procurements.reduce((s, r) => s + r.costUGX, 0);

    res.json({
      totalSalesAmount,
      totalSalesTonnage,
      totalCreditAmount,
      unpaidCredit,
      totalProcurementCost,
      salesCount: sales.length,
      creditCount: credits.length,
      stockLevels: stocks,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/sales-by-branch", auth, async (req, res) => {
  try {
    if (req.user.role !== "Director")
      return res.status(403).json({ error: "Only the Director can view all-branch reports." });

    const branches = ["Maganjo", "Matugga"];
    const report = {};
    for (const branch of branches) {
      const sales = await Sales.find({ branch });
      report[branch] = {
        totalAmount: sales.reduce((s, r) => s + r.amountPaidUGX, 0),
        totalTonnage: sales.reduce((s, r) => s + r.tonnageSoldKg, 0),
        count: sales.length,
      };
    }
    res.json(report);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
