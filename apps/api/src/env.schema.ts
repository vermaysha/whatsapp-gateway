import * as joi from 'joi'

export default joi.object({
  ENCRYPTION_KEY: joi.string().required(),
  BACKEND_PORT: joi.number().default(4000),
  SESSION_NAME: joi
    .string()
    .default('sessions')
    .regex(/^[a-zA-Z0-9\-._~]+$/),
  COOKIE_HTTPONLY: joi.boolean().default(true),
  COOKIE_SECURE: joi
    .alternatives()
    .try(joi.boolean(), joi.string().valid('auto'))
    .default('auto'),
  COOKIE_SAMESITE: joi
    .alternatives()
    .try(joi.boolean(), joi.string().valid('lax', 'none', 'strict'))
    .default('lax'),
  COOKIE_PATH: joi.string().default('/'),
  COOKIE_MAXAGE: joi.number().default(604_800).min(1),

  CORS_ORIGIN: joi
    .alternatives(joi.boolean(), joi.string(), joi.array().items(joi.string()))
    .default(false),
})
