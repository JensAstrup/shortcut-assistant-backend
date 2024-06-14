const mockRouter = {
  post: jest.fn(),
}

jest.mock('express', () => ({
  Router: () => mockRouter,
}))

jest.mock('../src/controllers/openAi', () => jest.fn())


describe('app', () => {
  it('should have a POST route to /api/openai', () => {

    require('../src/routes/api')

    expect(mockRouter.post).toHaveBeenCalledWith('/openai', expect.any(Function))
  })
})
