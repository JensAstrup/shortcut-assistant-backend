import tracer from 'dd-trace'
import { config } from 'dotenv'

import { logger } from '@sb/utils/logger'

import app from './app'


config()

// eslint-disable-next-line no-magic-numbers
const PORT = process.env.PORT || 3000

tracer.init({
  service: 'backend',
  hostname: 'datadog-agent',
  env: process.env.NODE_ENV,
  logInjection: true,
})

app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`)
})
