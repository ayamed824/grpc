import express from "express";
import cors from "cors";
import nodemailer from "nodemailer";

const app = express();
app.use(express.json());
app.use(cors());

// ---- EMAIL TRANSPORT ----
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: "ayamed200355@gmail.com",
    pass: "jyfdephqecvkgbji",
  },
});

// ---- SEND EMAIL ----
app.post("/send-email", async (req, res) => {
  const { to, subject, message } = req.body;

  try {
    await transporter.sendMail({
      from: "ayamed200355@gmail.com",
      to,
      subject,
      text: message,
    });

    res.json({ success: true });
  } catch (e) {
    console.log("EMAIL ERROR:", e);
    res.json({ success: false });
  }
});

// ---- START SERVER ----
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`🚀 REST API running on ${PORT}`));
