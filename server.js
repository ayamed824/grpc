import express from 'express';
import cors from 'cors';
import SibApiV3Sdk from 'sib-api-v3-sdk';

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;

// Config Sendinblue/Brevo
const client = SibApiV3Sdk.ApiClient.instance;
const apiKey = client.authentications['api-key'];
apiKey.apiKey = "GzV5vrUKSy30fFTW";  // <-- clé API mteek

const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();

app.post('/send-promo', async (req, res) => {
  const { email, promoCode, percent } = req.body;

  if (!email || !promoCode || !percent)
    return res.status(400).json({ success: false, message: "Missing data" });

  const sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail({
    to: [{ email }],
    sender: { email: "9c491f001@smtp-brevo.com", name: "Elles" }, // <-- sender vérifié Brevo
    subject: `Félicitations ! Votre code promo ${promoCode}`,
    htmlContent: `
      <h2>🎉 Bravo !</h2>
      <p>Vous avez gagné un code promo de <strong>${percent}</strong> !</p>
      <p>Code promo : <strong>${promoCode}</strong></p>
      <p>Utilisez-le pour votre prochaine commande.</p>
    `
  });

  try {
    await apiInstance.sendTransacEmail(sendSmtpEmail);
    res.json({ success: true });
  } catch (err) {
    console.error("Erreur envoi email:", err);
    res.status(500).json({ success: false, message: err.message });
  }
});

app.listen(PORT, () =>
  console.log(`Serveur en écoute sur http://localhost:${PORT}`)
);
