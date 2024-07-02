import authenticate from '@sb/controllers/users/authenticate'
import register from '@sb/controllers/users/register'


const mockRouter = {
  post: jest.fn(),
}

jest.mock('express', () => ({
  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  Router: () => mockRouter,
}))

jest.mock('@sb/controllers/users/register', () => jest.fn())
jest.mock('@sb/controllers/users/authenticate', () => jest.fn())

describe('router', () => {
  it('should add a post route to /openai', () => {
    require('@sb/routes/users') // Import the module here after the mock

    expect(mockRouter.post).toHaveBeenCalledWith('/register', register)
    expect(mockRouter.post).toHaveBeenCalledWith('/authenticate', authenticate)
  })
})
