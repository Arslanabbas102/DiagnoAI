import nodemailer from "nodemailer";

export const EMAIL_NOT_CONFIGURED =
  "Email isn't set up on this server yet, so this can't be sent right now.";

// Read at call time: route modules are imported before dotenv runs in index.js
export const isEmailConfigured = () =>
  Boolean(process.env.EMAIL_USER && process.env.APP_PASS);

export const createTransporter = () =>
  nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.APP_PASS,
    },
  });

export const sender = () => ({
  name: "DiagnoAI",
  address: process.env.EMAIL_USER,
});
