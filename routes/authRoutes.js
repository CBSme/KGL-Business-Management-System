const router = require("express").Router();
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const User = require("../models/User");
const auth = require("../middleware/auth");
const { sendResetEmail } = require("../utils/mailer");

// POST /api/auth/login
router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user) return res.status(401).json({ error: "Invalid username or password." });

    const match = await user.comparePassword(password);
    if (!match) return res.status(401).json({ error: "Invalid username or password." });

    const token = jwt.sign(
      {
        id: user._id,
        username: user.username,
        role: user.role,
        branch: user.branch,
        fullName: user.fullName,
      },
      process.env.JWT_SECRET,
      { expiresIn: "8h" }
    );

    res.json({
      token,
      user: {
        id: user._id,
        fullName: user.fullName,
        role: user.role,
        branch: user.branch,
        username: user.username,
      },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PATCH /api/auth/change-password
router.patch("/change-password", auth, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ error: "User not found." });

    const match = await user.comparePassword(currentPassword);
    if (!match) return res.status(401).json({ error: "Current password is incorrect." });

    if (!newPassword || newPassword.length < 6)
      return res.status(400).json({ error: "New password must be at least 6 characters." });

    user.password = newPassword;
    await user.save();
    res.json({ message: "Password changed successfully." });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PATCH /api/auth/reset-password/:userId  (Director/Manager resets another user's password)
router.patch("/reset-password/:userId", auth, async (req, res) => {
  try {
    if (!["Director", "Manager"].includes(req.user.role))
      return res.status(403).json({ error: "Access denied." });

    const { newPassword } = req.body;
    if (!newPassword || newPassword.length < 6)
      return res.status(400).json({ error: "Password must be at least 6 characters." });

    const user = await User.findById(req.params.userId);
    if (!user) return res.status(404).json({ error: "User not found." });

    user.password = newPassword;
    await user.save();
    res.json({ message: `Password reset successfully for ${user.fullName}.` });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// GET /api/auth/users  (list all users for management page)
router.get("/users", auth, async (req, res) => {
  try {
    if (!["Director", "Manager"].includes(req.user.role))
      return res.status(403).json({ error: "Access denied." });
    const users = await User.find({}, "-password -resetToken -resetTokenExpiry").sort({
      role: 1,
      fullName: 1,
    });
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/auth/forgot-password
router.post("/forgot-password", async (req, res) => {
  try {
    const { username } = req.body;
    if (!username) return res.status(400).json({ error: "Please provide a username." });

    const user = await User.findOne({ username });

    // Always return success to prevent username enumeration
    if (!user || !user.email) {
      return res.json({
        message: "If that username exists and has an email on file, a reset link has been sent.",
      });
    }

    // Generate secure token
    const token = crypto.randomBytes(32).toString("hex");
    user.resetToken = token;
    user.resetTokenExpiry = Date.now() + 60 * 60 * 1000; // 1 hour
    await user.save();

    const resetUrl = `${process.env.APP_URL}/reset-password.html?token=${token}`;
    await sendResetEmail(user.email, user.fullName, resetUrl);

    res.json({
      message: "If that username exists and has an email on file, a reset link has been sent.",
    });
  } catch (err) {
    console.error("Forgot password error:", err.message);
    res.status(500).json({ error: "Failed to send reset email. Please try again." });
  }
});

// POST /api/auth/reset-password-token
router.post("/reset-password-token", async (req, res) => {
  try {
    const { token, newPassword } = req.body;
    if (!token || !newPassword)
      return res.status(400).json({ error: "Token and new password are required." });

    if (newPassword.length < 6)
      return res.status(400).json({ error: "Password must be at least 6 characters." });

    const user = await User.findOne({
      resetToken: token,
      resetTokenExpiry: { $gt: Date.now() },
    });

    if (!user)
      return res.status(400).json({
        error: "This reset link is invalid or has expired. Please request a new one.",
      });

    user.password = newPassword;
    user.resetToken = undefined;
    user.resetTokenExpiry = undefined;
    await user.save();

    res.json({
      message: "Password reset successfully! You can now log in with your new password.",
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
