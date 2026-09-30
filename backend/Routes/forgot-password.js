import express from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import User from "../models/UserSchema.js";
import {
  EMAIL_NOT_CONFIGURED,
  createTransporter,
  isEmailConfigured,
  sender,
} from "../utils/mailer.js";

const router = express.Router();

const RESET_SENT =
  "If an account exists for that email, we've sent a password reset link.";
const INVALID_LINK =
  "This reset link is invalid or has expired. Please request a new one.";

// Including the current password hash makes each link single-use:
// once the password changes, older links no longer verify.
const resetSecret = (user) => `${process.env.JWT_SECRET_KEY}${user.password}`;

router.post("/forgot-password", async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: "Please enter your email address." });
  }
  if (!isEmailConfigured()) {
    return res.status(503).json({ message: EMAIL_NOT_CONFIGURED });
  }

  try {
    const user = await User.findOne({ email });
    // Same answer either way, so the form can't be used to discover accounts
    if (!user) {
      return res.status(200).json({ message: RESET_SENT });
    }

    const token = jwt.sign({ id: user._id.toString() }, resetSecret(user), {
      expiresIn: "1h",
    });
    const siteUrl = process.env.CLIENT_SITE_URL || "http://localhost:5173";
    const link = `${siteUrl}/reset-password/${user._id}/${token}`;

    await createTransporter().sendMail({
      from: sender(),
      to: user.email,
      subject: "Reset your DiagnoAI password",
      text: `Hi ${user.name},\n\nUse this link to choose a new password. It is valid for 1 hour:\n${link}\n\nIf you didn't ask for a password reset, you can ignore this email.`,
    });

    res.status(200).json({ message: RESET_SENT });
  } catch (error) {
    console.error("Error sending reset email:", error);
    res.status(500).json({
      message: "We couldn't send the reset email. Please try again later.",
    });
  }
});

router.post("/reset-password/:id/:token", async (req, res) => {
  const { id, token } = req.params;
  const { password } = req.body;

  if (!password || password.length < 6) {
    return res
      .status(400)
      .json({ message: "Your new password must be at least 6 characters." });
  }

  try {
    const user = await User.findById(id);
    if (!user) {
      return res.status(400).json({ message: INVALID_LINK });
    }

    const decoded = jwt.verify(token, resetSecret(user));
    if (decoded.id !== id) {
      return res.status(400).json({ message: INVALID_LINK });
    }

    const hash = await bcrypt.hash(password, 10);
    await User.updateOne({ _id: id }, { password: hash });
    res
      .status(200)
      .json({ message: "Password updated. You can now log in." });
  } catch (error) {
    res.status(400).json({ message: INVALID_LINK });
  }
});

export default router;
