const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { body, validationResult } = require('express-validator');
const env = require('../config/env');
const ApiError = require('../utils/ApiError');
const asyncHandler = require('../utils/asyncHandler');
const userModel = require('../models/userModel');
const refreshTokenModel = require('../models/refreshTokenModel');
const passwordResetModel = require('../models/passwordResetModel');

const REFRESH_TTL_MS = 7 * 24 * 60 * 60 * 1000;
const RESET_TTL_MS = 60 * 60 * 1000;

function issueTokens(user) {
  const payload = { sub: user.id, role: user.role, email: user.email };
  const accessToken = jwt.sign(payload, env.jwt.accessSecret, { expiresIn: env.jwt.accessExpiresIn });
  const refreshToken = jwt.sign(payload, env.jwt.refreshSecret, { expiresIn: env.jwt.refreshExpiresIn });
  return { accessToken, refreshToken };
}

const registerValidators = [
  body('nom').trim().notEmpty(),
  body('prenom').trim().notEmpty(),
  body('email').isEmail().normalizeEmail(),
  body('mot_de_passe').isLength({ min: 8 }),
];

const register = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) throw new ApiError(400, 'Données invalides.', errors.array());

  const { nom, prenom, email, mot_de_passe: motDePasse } = req.body;

  const existing = await userModel.findByEmail(email);
  if (existing) throw new ApiError(409, 'Un compte existe déjà avec cet e-mail.');

  // Le rôle n'est jamais accepté depuis le client : l'inscription publique crée toujours un étudiant.
  const motDePasseHash = await bcrypt.hash(motDePasse, 10);
  const user = await userModel.create({ nom, prenom, email, motDePasseHash, role: 'etudiant' });

  res.status(201).json({ user });
});

const loginValidators = [body('email').isEmail().normalizeEmail(), body('mot_de_passe').notEmpty()];

const login = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) throw new ApiError(400, 'Données invalides.', errors.array());

  const { email, mot_de_passe: motDePasse } = req.body;
  const user = await userModel.findByEmail(email);
  if (!user) throw new ApiError(401, 'E-mail ou mot de passe incorrect.');

  const match = await bcrypt.compare(motDePasse, user.mot_de_passe);
  if (!match) throw new ApiError(401, 'E-mail ou mot de passe incorrect.');

  const { accessToken, refreshToken } = issueTokens(user);
  await refreshTokenModel.store(user.id, refreshToken, new Date(Date.now() + REFRESH_TTL_MS));

  res.json({
    accessToken,
    refreshToken,
    user: { id: user.id, nom: user.nom, prenom: user.prenom, email: user.email, role: user.role },
  });
});

const refresh = asyncHandler(async (req, res) => {
  const { refreshToken } = req.body;
  if (!refreshToken) throw new ApiError(400, 'Jeton de rafraîchissement requis.');

  let payload;
  try {
    payload = jwt.verify(refreshToken, env.jwt.refreshSecret);
  } catch {
    throw new ApiError(401, 'Jeton de rafraîchissement invalide ou expiré.');
  }

  const stored = await refreshTokenModel.findValid(refreshToken);
  if (!stored) throw new ApiError(401, 'Jeton de rafraîchissement révoqué ou inconnu.');

  const user = await userModel.findById(payload.sub);
  if (!user) throw new ApiError(401, 'Utilisateur introuvable.');

  await refreshTokenModel.revoke(refreshToken);
  const tokens = issueTokens(user);
  await refreshTokenModel.store(user.id, tokens.refreshToken, new Date(Date.now() + REFRESH_TTL_MS));

  res.json(tokens);
});

const logout = asyncHandler(async (req, res) => {
  const { refreshToken } = req.body;
  if (refreshToken) await refreshTokenModel.revoke(refreshToken);
  res.status(204).send();
});

const forgotPasswordValidators = [body('email').isEmail().normalizeEmail()];

const GENERIC_FORGOT_MESSAGE = "Si un compte existe avec cet e-mail, un lien de réinitialisation a été envoyé.";

const forgotPassword = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) throw new ApiError(400, 'Données invalides.', errors.array());

  const { email } = req.body;
  const user = await userModel.findByEmail(email);

  // Même réponse que le compte existe ou non, pour ne pas révéler quels e-mails sont inscrits.
  if (!user) {
    return res.json({ message: GENERIC_FORGOT_MESSAGE });
  }

  const token = crypto.randomBytes(32).toString('hex');
  await passwordResetModel.create(user.id, token, new Date(Date.now() + RESET_TTL_MS));

  const resetLink = `${env.frontendUrl}/reinitialiser-mot-de-passe?token=${token}`;
  // Aucun service d'e-mail n'est encore branché (SMTP/SES/...) : le lien est journalisé côté
  // serveur et, hors production, renvoyé directement pour permettre de tester le flux de bout en bout.
  console.log(`[E-UNI] Lien de réinitialisation pour ${email} : ${resetLink}`);

  if (env.nodeEnv !== 'production') {
    return res.json({ message: GENERIC_FORGOT_MESSAGE, resetToken: token, resetLink });
  }

  res.json({ message: GENERIC_FORGOT_MESSAGE });
});

const resetPasswordValidators = [body('token').notEmpty(), body('mot_de_passe').isLength({ min: 8 })];

const resetPassword = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) throw new ApiError(400, 'Données invalides.', errors.array());

  const { token, mot_de_passe: motDePasse } = req.body;
  const reset = await passwordResetModel.findValid(token);
  if (!reset) throw new ApiError(400, 'Jeton de réinitialisation invalide ou expiré.');

  const motDePasseHash = await bcrypt.hash(motDePasse, 10);
  await userModel.updatePassword(reset.utilisateur_id, motDePasseHash);
  await passwordResetModel.markUsed(token);
  await refreshTokenModel.revokeAllForUser(reset.utilisateur_id);

  res.json({ message: 'Mot de passe mis à jour. Veuillez vous reconnecter.' });
});

module.exports = {
  register,
  login,
  refresh,
  logout,
  forgotPassword,
  resetPassword,
  registerValidators,
  loginValidators,
  forgotPasswordValidators,
  resetPasswordValidators,
};
