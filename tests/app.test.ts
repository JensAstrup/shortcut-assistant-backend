const mockRouter = {
  post: jest.fn(),
}

jest.mock('express', () => ({
  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  Router: () => mockRouter,
}))

jest.mock('@sb/controllers/openAi', () => jest.fn())


describe('app', () => {
  it('should have a POST route to /api/openai', () => {
    require('../src/routes/api')

    expect(mockRouter.post).toHaveBeenCalledWith('/openai', expect.any(Function))
  })
})
