import googleAuthenticate, { GoogleUserInfo } from '@sb/controllers/users/utils/google-authenticate'
import logger from '@sb/utils/logger'


// Mocking fetch and logger
jest.mock('@sb/utils/logger', () => ({
  error: jest.fn(),
}))
global.fetch = jest.fn()

describe('googleAuthenticate', () => {
  const token = 'valid_token'
  const userInfo: GoogleUserInfo = {
    email: 'test@example.com',
    email_verified: true,
    family_name: 'Doe',
    given_name: 'John',
    locale: 'en',
    name: 'John Doe',
    picture: 'https://example.com/johndoe.jpg',
    sub: '1234567890'
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should throw an error when token is not provided', async () => {
    await expect(googleAuthenticate('')).rejects.toThrow('Token is required')
  })

  it('should throw an error when fetch fails with a non-200 status', async () => {
    (fetch as jest.Mock).mockResolvedValue({
      ok: false,
    })

    await expect(googleAuthenticate(token)).rejects.toThrow('Failed to fetch user info')
  })

  it('should return user info when fetch succeeds', async () => {
    (fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: jest.fn().mockResolvedValue(userInfo),
    })

    const result = await googleAuthenticate(token)
    expect(result).toEqual(userInfo)
  })

  it('should log error and throw when fetch fails with an error having a message', async () => {
    const errorMessage = 'Network error'
    const error = new Error(errorMessage)

    ;(fetch as jest.Mock).mockRejectedValue(error)

    await expect(googleAuthenticate(token)).rejects.toThrow(errorMessage)
    expect(logger.error).toHaveBeenCalledWith(errorMessage, error)
  })

  it('should log error and throw when fetch fails with an error without a message', async () => {
    const mockFetch = fetch as jest.MockedFunction<typeof fetch>
    const error = new Error()

    mockFetch.mockRejectedValue(error)

    await expect(googleAuthenticate(token)).rejects.toThrow(error)
    expect(logger.error).toHaveBeenCalledWith('Error verifying token', error)
  })
})
