import * as Sentry from '@sentry/node'


jest.mock('@sentry/node')

describe('Sentry Initialization', () => {
  test('It should call Sentry.init with correct parameters', () => {
    require('@sb/utils/sentry-tracer')
    expect(Sentry.init).toHaveBeenCalledWith({
      dsn: process.env.SENTRY_DSN,
      integrations: expect.any(Array),
      tracesSampleRate: 1.0,
      profilesSampleRate: 1.0,
      environment: process.env.NODE_ENV,
    })
  })
})
