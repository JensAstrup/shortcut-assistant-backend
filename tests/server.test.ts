import logger from '@sb/utils/logger'


const mockApp = {
  listen: jest.fn((port, callback: () => void) => {
    callback()
  }),
}

const mockDatabase = {
  initialize: jest.fn(),
}

jest.mock('@sb/app', () => mockApp)
jest.mock('@sb/db', () => mockDatabase)
jest.mock('@sb/utils/logger')

const mockLogger = logger as jest.Mocked<typeof logger>


describe('server', () => {
  let exitSpy: jest.SpyInstance

  beforeEach(() => {
    jest.clearAllMocks()
    exitSpy = jest.spyOn(process, 'exit').mockImplementation((code) => {
      throw new Error(`process.exit: ${code}`)
    })
  })

  afterEach(() => {
    exitSpy.mockRestore()
  })

  it('should listen on a port', async () => {
    await import('@sb/server')
    expect(mockApp.listen).toHaveBeenCalled()
    expect(mockDatabase.initialize).toHaveBeenCalled()
    expect((mockLogger.info)).toHaveBeenCalledWith('Database connected')
    expect((mockLogger.info)).toHaveBeenCalledWith('Server running on port 3000')
  })

  it('should log an error if the database connection fails', async () => {
    mockDatabase.initialize.mockRejectedValueOnce(new Error('Database connection failed'))
    const startServer = await import('@sb/server')
    await expect(startServer.default).rejects.toThrow('process.exit: 1')
    expect(mockLogger.error).toHaveBeenCalledWith('Database connection error', expect.any(Error))
    expect((mockLogger.error as jest.Mock).mock.calls[0][1].message).toBe('Database connection failed')
    expect(exitSpy).toHaveBeenCalledWith(1)
  })
})
