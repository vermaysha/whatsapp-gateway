import { INestiaConfig } from '@nestia/sdk'
import { globSync } from 'fast-glob'

const config: INestiaConfig = {
  input: globSync('./src/**/*.controller.ts'),
  swagger: {
    output: 'dist/swagger.json',
    security: {
      bearer: {
        type: 'apiKey',
        name: 'Authorization',
        in: 'header',
      },
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Local Server',
      },
    ],
  },
}
export default config
