import cors from 'cors'


const mockApp = {
  use: jest.fn()
}
const mockJson = jest.fn()
const mockRouter = {
  post: jest.fn(),

}
jest.mock('express', () => {
  return {
    __esModule: true,
    default: jest.fn().mockReturnValue(mockApp),
    json: jest.fn(() => mockJson), // Mock express.json
    Router: jest.fn(() => mockRouter)
  }
})

jest.mock('cors', () => jest.fn())
const mockCors = cors as jest.MockedFunction<typeof cors>
mockCors.mockReturnValue(jest.fn())

jest.mock('@sentry/node')

jest.mock('@sb/controllers/openAi', () => jest.fn())


describe('app', () => {
  it('should use cors settings', async () => {
    await import('@sb/app')
    expect(mockCors).toHaveBeenCalledWith({
      origin: 'chrome-extension://kmdlofehocppnlkpokdbiaalcelhedef',
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization']
    })
    expect(mockApp.use).toHaveBeenCalledWith(mockJson)
    expect(mockApp.use.mock.calls[2][0]).toEqual('/api')
    expect(mockApp.use.mock.calls[2][1]).toEqual(mockRouter)
    expect(mockApp.use.mock.calls[3][0]).toEqual('/users')
    expect(mockApp.use.mock.calls[3][1]).toEqual(mockRouter)
  })
})
