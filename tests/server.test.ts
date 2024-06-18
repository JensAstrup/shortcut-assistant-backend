const mockApp = {
  listen: jest.fn(),
}

jest.mock('@sb/app', () => mockApp)

describe('server', () => {
  it('should listen on a port', () => {
    require('@sb/server')

    expect(mockApp.listen).toHaveBeenCalled()
  })
})
