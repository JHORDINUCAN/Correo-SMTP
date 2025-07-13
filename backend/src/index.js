require('dotenv').config();
const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');

const app = express();
app.use(cors());
app.use(express.json());

app.get('/', (_, res) => res.send('Newsletter Builder – Backend OK'));

// Configuración de Gmail SMTP
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS,
  },
});

app.post('/send-email', async (req, res) => {
  const { email, subject, content } = req.body;
  if (!email || !subject || !content) {
    return res
      .status(400)
      .json({ error: 'email, subject y content son obligatorios.' });
  }

  try {
    await transporter.sendMail({
      from: process.env.GMAIL_USER,
      to: email,
      subject,
      html: content,
    });
    return res.status(200).json({ success: true });
  } catch (err) {
    console.error('Error Gmail SMTP:', err);
    return res
      .status(500)
      .json({ error: 'Fallo interno al enviar el email vía Gmail.' });
  }
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () =>
  console.log(`🚀 Server escuchando en http://localhost:${PORT}`)
);
