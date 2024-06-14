const mockApp = {
  listen: jest.fn(),
}

jest.mock('../src/app', () => mockApp)


describe('server', () => {
  it('should listen on a port', () => {

    require('../src/server')

    expect(mockApp.listen).toHaveBeenCalled()
  })
})
