const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { body, validationResult } = require('express-validator');
const env = require('../config/env');
const ApiError = require('../utils/ApiError');
const asyncHandler = require('../utils/asyncHandler');
const userModel = require('../models/userModel');
const refreshTokenModel = require('../models/refreshTokenModel');

const REFRESH_TTL_MS = 7 * 24 * 60 * 60 * 1000;

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

module.exports = { register, login, refresh, logout, registerValidators, loginValidators };
