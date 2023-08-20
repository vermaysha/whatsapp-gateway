import pino from 'pino'

export const logger = pino({
  enabled: true,
  timestamp: () => `,"time":"${new Date().toJSON()}"`,
})
