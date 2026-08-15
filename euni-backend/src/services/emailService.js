const { Resend } = require('resend');
const env = require('../config/env');

const resend = env.email.apiKey ? new Resend(env.email.apiKey) : null;

async function sendPasswordResetEmail(to, resetLink) {
  if (!resend) {
    console.log(`[E-UNI] RESEND_API_KEY absent — e-mail non envoyé. Lien : ${resetLink}`);
    return null;
  }

  const { data, error } = await resend.emails.send({
    from: env.email.from,
    to,
    subject: 'Réinitialisation de votre mot de passe E-UNI',
    html: `
      <p>Vous avez demandé la réinitialisation de votre mot de passe sur E-UNI.</p>
      <p><a href="${resetLink}">Cliquez ici pour choisir un nouveau mot de passe</a> (lien valide 1 heure).</p>
      <p>Si vous n'êtes pas à l'origine de cette demande, ignorez cet e-mail.</p>
    `,
  });

  if (error) throw new Error(error.message || "Échec de l'envoi de l'e-mail.");
  return data;
}

module.exports = { sendPasswordResetEmail };
