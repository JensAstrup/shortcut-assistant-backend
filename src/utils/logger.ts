import * as process from 'node:process'

import DatadogWinston from 'datadog-winston'
import { Logger, createLogger, format, transports } from 'winston'

import { version } from '../../package.json'


const logger: Logger = createLogger({
  level: 'debug',
  format: format.json(),
  defaultMeta: { service: 'backend', version },
})

const environment = process.env.NODE_ENV || 'development'
if ((!environment.includes('production') && !environment.includes('staging')) || process.env.CONSOLE_LOGS === 'true') {
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
