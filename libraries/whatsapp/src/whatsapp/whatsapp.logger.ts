import pino from "pino";

export const logger = pino({
  enabled: true,
  name: 'Whatsapp Worker',
  timestamp: () => `,"time":"${new Date().toJSON()}"`,
});
