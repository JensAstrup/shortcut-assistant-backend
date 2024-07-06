import * as Sentry from '@sentry/node'
import cors from 'cors'


const mockApp = {
  use: jest.fn()
}
const mockJson = jest.fn()
const mockRouter = {
  post: jest.fn(),
  get: jest.fn()
}
jest.mock('express', () => {
  return {
    __esModule: true,
    default: jest.fn().mockReturnValue(mockApp),
    json: jest.fn(() => mockJson),
    Router: jest.fn(() => mockRouter)
  }
})

const mockSentrySetup = jest.spyOn(Sentry, 'setupExpressErrorHandler').mockImplementation(jest.fn())

jest.mock('cors', () => jest.fn())
const mockCors = cors as jest.MockedFunction<typeof cors>
mockCors.mockReturnValue(jest.fn())

jest.mock('@sentry/node')

jest.mock('@sb/controllers/ai/analyze/analysis', () => jest.fn())
jest.mock('@sb/controllers/ai/labels/controller', () => jest.fn())
const mockAuthMiddleware = jest.fn()
jest.mock('@sb/middleware/auth-headers', () => mockAuthMiddleware)


describe('app', () => {
  it('should use cors settings', async () => {
    await import('@sb/app')
    expect(mockCors).toHaveBeenCalledWith({
      origin: 'chrome-extension://kmdlofehocppnlkpokdbiaalcelhedef',
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization']
    })

    expect(mockApp.use.mock.calls[0][0]).toEqual(mockCors.mock.results[0].value)

    expect(mockApp.use.mock.calls[1][0]).toEqual(mockJson)

    expect(mockApp.use.mock.calls[2][0]).toEqual('/api')
    expect(mockApp.use.mock.calls[2][1]).toEqual(mockRouter)

    expect(mockApp.use.mock.calls[3][0]).toEqual('/users')
    expect(mockApp.use.mock.calls[3][1]).toEqual(mockRouter)

    expect(mockApp.use.mock.calls[4][0]).toEqual(mockAuthMiddleware)

    expect(mockApp.use.mock.calls[5][0]).toEqual('/labels')
    expect(mockApp.use.mock.calls[5][1]).toEqual(mockRouter)

    expect(mockSentrySetup).toHaveBeenCalledWith(mockApp)
  })
})
