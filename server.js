const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const path = require("path");

const authRoutes = require("./routes/authRoutes");
const procurementRoutes = require("./routes/procurementRoutes");
const creditRoutes = require("./routes/creditRoutes");
const salesRoutes = require("./routes/salesRoutes");
const reportRoutes = require("./routes/reportRoutes");
const stockRoutes = require("./routes/stockRoutes");

dotenv.config();
const app = express();

app.use(express.json());
app.use(cors());
app.use(express.static(path.join(__dirname, "public")));
app.get("/", (_req, res) => res.redirect("/login.html"));

app.use("/api/auth", authRoutes);
app.use("/api/procurement", procurementRoutes);
app.use("/api/credit", creditRoutes);
app.use("/api/sales", salesRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/stock", stockRoutes);

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ Connected to KGL MongoDB"))
  .catch((err) => console.error("❌ MongoDB Connection Error:", err));

app.use((err, req, res, _next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Something went wrong on the server!" });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 KGL Server running on http://localhost:${PORT}`);
});
