

const mockApp = {
  listen: jest.fn(),
}

const mockDatabase = {
  initialize: jest.fn(),
}

jest.mock('@sb/app', () => mockApp)
jest.mock('@sb/db', () => mockDatabase)

describe('server', () => {
  it('should listen on a port', async () => {
    const { default: startServer } = await import('@sb/server')
    await startServer()
    expect(mockApp.listen).toHaveBeenCalled()
    expect(mockDatabase.initialize).toHaveBeenCalled()
  })
})
