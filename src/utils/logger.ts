import DatadogWinston from 'datadog-winston'
import { Logger, createLogger, format } from 'winston'


export const logger: Logger = createLogger({
  level: 'debug',
  format: format.json(),
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
