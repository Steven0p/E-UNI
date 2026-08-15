const required = ['DB_HOST', 'DB_USER', 'DB_PASSWORD', 'DB_NAME', 'JWT_ACCESS_SECRET', 'JWT_REFRESH_SECRET'];

function loadEnv() {
  const missing = required.filter((key) => !process.env[key]);
  if (missing.length > 0) {
    throw new Error(`Variables d'environnement manquantes : ${missing.join(', ')}`);
  }

  return {
    port: process.env.PORT || 5000,
    nodeEnv: process.env.NODE_ENV || 'development',
    db: {
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT) || 3306,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    },
    jwt: {
      accessSecret: process.env.JWT_ACCESS_SECRET,
      accessExpiresIn: process.env.JWT_ACCESS_EXPIRES_IN || '15m',
      refreshSecret: process.env.JWT_REFRESH_SECRET,
      refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
    },
    moncash: {
      mode: process.env.MONCASH_MODE || 'sandbox',
      clientId: process.env.MONCASH_CLIENT_ID,
      clientSecret: process.env.MONCASH_CLIENT_SECRET,
      returnUrl: process.env.MONCASH_RETURN_URL,
    },
    corsOrigin: process.env.CORS_ORIGIN || '*',
    frontendUrl: process.env.FRONTEND_URL || 'http://localhost:3000',
    email: {
      apiKey: process.env.RESEND_API_KEY,
      from: process.env.EMAIL_FROM || 'E-UNI <onboarding@resend.dev>',
    },
  };
}

module.exports = loadEnv();
