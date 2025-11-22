import express from 'express';
import cors from 'cors';
import nodemailer from 'nodemailer';

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;

// === Configuration Gmail avec App Password ===
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'ayamed200355@gmail.com',         // ton Gmail
    pass: 'cqseyqgclpqedyxb',     // mot de passe d’application Gmail
  },
});

// === Endpoint pour envoyer le code promo ===
app.post('/send-promo', async (req, res) => {
  const { email, promoCode, percent } = req.body;

  if (!email || !promoCode || !percent) {
    return res.status(400).json({ success: false, message: "Données manquantes" });
  }

  try {
    const mailOptions = {
      from: 'tonemail@gmail.com',
      to: email,
      subject: `Félicitations ! Votre code promo ${promoCode}`,
      html: `
        <h2>🎉 Bravo !</h2>
        <p>Vous avez atteint un nouveau palier de commandes et gagnez un code promo de <strong>${percent}</strong> !</p>
        <p>Code promo : <strong>${promoCode}</strong></p>
        <p>Vous pouvez l'utiliser une seule fois lors de votre prochaine commande.</p>
        <br>
        <p>Merci pour votre fidélité !</p>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log(`Email promo envoyé à ${email} avec ${promoCode}`);

    res.json({ success: true });
  } catch (err) {
    console.error("Erreur envoi email:", err);
    res.status(500).json({ success: false, message: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Serveur REST promo en écoute sur http://localhost:${PORT}`);
});
