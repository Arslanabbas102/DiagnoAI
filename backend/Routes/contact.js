import express from "express";
import {
  EMAIL_NOT_CONFIGURED,
  createTransporter,
  isEmailConfigured,
  sender,
} from "../utils/mailer.js";

const router = express.Router();

// POST route for form submission
router.post("/contact", async (req, res) => {
  const { email, subject, message } = req.body;

  if (!email || !message) {
    return res
      .status(400)
      .json({ message: "Please add your email address and a message." });
  }
  if (!isEmailConfigured()) {
    return res.status(503).json({ message: EMAIL_NOT_CONFIGURED });
  }

  try {
    await createTransporter().sendMail({
      from: sender(),
      replyTo: email,
      // Messages go to CONTACT_TO, or to the sending mailbox if it isn't set
      to: process.env.CONTACT_TO || process.env.EMAIL_USER,
      subject: subject || "New message from the DiagnoAI contact form",
      text: `Email: ${email}\n\nMessage: ${message}`,
    });

    res
      .status(200)
      .json({ message: "Message sent! We'll get back to you soon." });
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).json({
      message: "We couldn't send your message right now. Please try again later.",
    });
  }
});

export default router;
