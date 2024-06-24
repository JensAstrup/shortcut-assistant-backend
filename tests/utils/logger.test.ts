import * as process from 'node:process'

import DatadogWinston from 'datadog-winston'
import { createLogger, transports } from 'winston'


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
    Logger: jest.fn(() => mLogger),
    transports: {
      Console: jest.fn()
    }
  }
})
jest.mock('../../package.json', () => ({
  version: '1.0.0'
}))
jest.mock('node:process', () => ({
  env: {
    DD_API_KEY: 'datadog-api-key',
    NODE_ENV: 'development'
  }
}))

import logger from '@sb/utils/logger'


describe('Logger', () => {
  it('should be created with the correct configuration', () => {
    expect(logger).toBeInstanceOf(createLogger().constructor)

    expect(logger.level).toBe('debug')

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    expect(logger.format).toStrictEqual({ json: expect.any(Function) })

    expect(logger.defaultMeta).toEqual({ service: 'backend' })
    expect(logger.add).toHaveBeenCalledTimes(2)
    expect(transports.Console).toHaveBeenCalled()
  })

  it('should add DatadogWinston transport with the correct options', () => {
    expect(DatadogWinston).toHaveBeenCalledWith({
      apiKey: 'datadog-api-key',
      hostname: 'datadog-agent',
      service: 'backend',
      ddsource: 'nodejs',
      intakeRegion: 'us5',
      ddtags: `env:${process.env.NODE_ENV},version:1.0.0`,
    })

    expect(logger.add).toHaveBeenCalledWith(expect.any(DatadogWinston))
  })
})
