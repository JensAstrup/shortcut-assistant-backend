import processAnalysis from '@sb/controllers/ai/analyze/analysis'


const mockRouter = {
  post: jest.fn(),
}

jest.mock('express', () => ({
  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  Router: () => mockRouter,
}))

jest.mock('@sb/controllers/ai/analyze/analysis', () => jest.fn())

describe('router', () => {
  it('should add a post route to /openai', () => {
    require('@sb/routes/api') // Import the module here after the mock

    expect(mockRouter.post).toHaveBeenCalledWith('/openai', processAnalysis)
  })
})
