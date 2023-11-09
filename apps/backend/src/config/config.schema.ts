import * as Joi from 'joi';

export default Joi.object({
  PORT: Joi.number().default(3000),
  HOST: Joi.string().ip().default('0.0.0.0'),
  ENCRYPTION_KEY: Joi.string().required(),
  FRONTEND_URL: Joi.string().required(),
});
