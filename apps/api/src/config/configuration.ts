export default () => ({
  port: process.env.BACKEND_PORT,
  encryptionKey: process.env.ENCRYPTION_KEY,

  session: {
    name: process.env.SESSION_NAME,
  },

  cookie: {
    httpOnly: process.env.COOKIE_HTTPONLY,
    secure: process.env.COOKIE_SECURE,
    sameSite: process.env.COOKIE_SAMESITE,
    path: process.env.COOKIE_PATH,
    maxAge: process.env.COOKIE_MAXAGE,
  },

  cors: {
    origin: process.env.CORS_ORIGIN,
  },
})
