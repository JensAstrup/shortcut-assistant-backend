import * as process from 'node:process'

import DatadogWinston from 'datadog-winston'
import tracer from 'dd-trace'
import { config } from 'dotenv'
import winston from 'winston'

import app from './app'


config()

// eslint-disable-next-line no-magic-numbers
const PORT = process.env.PORT || 3000


const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  defaultMeta: { service: 'backend' },
})

logger.add(
  new DatadogWinston({
    apiKey: <string>process.env.DD_API_KEY,
    hostname: 'datadog-agent',
    service: 'backend',
    ddsource: 'nodejs',
    intakeRegion: 'us5'
  })
)


tracer.init({
  service: 'backend',
  hostname: 'datadog-agent',
  env: process.env.NODE_ENV,
  logInjection: true,
})

app.listen(PORT, () => {
  logger.info(`3 Server running on port ${PORT}`)
})
