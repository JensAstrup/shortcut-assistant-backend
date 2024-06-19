import DatadogWinston from 'datadog-winston'
import { createLogger } from 'winston'


jest.mock('datadog-winston')
jest.mock('winston', () => {
  const mFormat = {
    json: jest.fn()
  }
  const mLogger = {
    add: jest.fn(),
    level: 'debug',
    format: mFormat,
    defaultMeta: { service: 'backend' }
  }
  return {
    createLogger: jest.fn().mockReturnValue(mLogger),
    format: mFormat,
    Logger: jest.fn(() => mLogger)
  }
})

import { logger } from '@sb/utils/logger'


describe('Logger', () => {
  it('should be created with the correct configuration', () => {
    expect(logger).toBeInstanceOf(createLogger().constructor)

    expect(logger.level).toBe('debug')

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    expect(logger.format).toStrictEqual({ json: expect.any(Function) })

    expect(logger.defaultMeta).toEqual({ service: 'backend' })
  })

  it('should add DatadogWinston transport with the correct options', () => {
    expect(DatadogWinston).toHaveBeenCalledWith({
      apiKey: process.env.DD_API_KEY,
      hostname: 'datadog-agent',
      service: 'backend',
      ddsource: 'nodejs',
      intakeRegion: 'us5'
    })

    expect(logger.add).toHaveBeenCalledWith(expect.any(DatadogWinston))
  })
})
