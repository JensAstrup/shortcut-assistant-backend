import processAnalysis from '../../src/controllers/openAi'


const mockRouter = {
  post: jest.fn(),
}

jest.mock('express', () => ({
  Router: () => mockRouter,
}))

jest.mock('../../src/controllers/openAi', () => jest.fn())

describe('router', () => {
  it('should add a post route to /openai', () => {
    require('../../src/routes/api') // Import the module here after the mock

    expect(mockRouter.post).toHaveBeenCalledWith('/openai', processAnalysis)
  })
})
