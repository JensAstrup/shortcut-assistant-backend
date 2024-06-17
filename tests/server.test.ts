const mockApp = {
  listen: jest.fn(),
}

jest.mock('@sb/app', () => mockApp)
jest.mock('datadog-winston')
jest.mock('winston', () => ({
  createLogger: jest.fn().mockReturnValue({
    add: jest.fn()
  }),
  format: {
    json: jest.fn()
  }
}))

describe('server', () => {
  it('should listen on a port', () => {
    require('@sb/server')

    expect(mockApp.listen).toHaveBeenCalled()
  })
})
