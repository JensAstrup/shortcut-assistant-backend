import DatadogWinston from 'datadog-winston'
import { Logger, createLogger, format } from 'winston'


const logger: Logger = createLogger({
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
    intakeRegion: 'us5',
    ddtags: `env:${process.env.NODE_ENV},version:${process.env.VERSION}`,
  })
)

export default logger
