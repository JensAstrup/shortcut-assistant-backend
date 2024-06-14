import processAnalysis from '@sb/controllers/openAi'


const mockRouter = {
  post: jest.fn(),
}

jest.mock('express', () => ({
  Router: () => mockRouter,
}))

jest.mock('@sb/controllers/openAi', () => jest.fn())

describe('router', () => {
  it('should add a post route to /openai', () => {
    require('@sb/routes/api') // Import the module here after the mock

    expect(mockRouter.post).toHaveBeenCalledWith('/openai', processAnalysis)
  })
})
