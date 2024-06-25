import * as process from 'node:process'

import DatadogWinston from 'datadog-winston'
import { Logger, createLogger, format, transports } from 'winston'

import { version } from '../../package.json'


const environment = process.env.NODE_ENV || 'development'

const logger: Logger = createLogger({
  level: 'debug',
  format: format.json(),
  defaultMeta: { service: 'backend', version, environment },
})

const nonLoggingEnvironments = ['production', 'staging', 'test']
if (!nonLoggingEnvironments.includes(environment) || process.env.CONSOLE_LOGS === 'true') {
  logger.add(new transports.Console())
}

logger.add(
  new DatadogWinston({
    apiKey: <string>process.env.DD_API_KEY,
    hostname: 'datadog-agent',
    service: 'backend',
    ddsource: 'nodejs',
    intakeRegion: 'us5',
    ddtags: `env:${process.env.NODE_ENV},version:${version}`,
  })
)

export default logger
