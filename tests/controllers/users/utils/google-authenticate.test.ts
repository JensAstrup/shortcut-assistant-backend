import dotenv from 'dotenv'
import { OAuth2Client, TokenPayload } from 'google-auth-library'

import googleAuthenticate from '@sb/controllers/users/utils/google-authenticate'
import logger from '@sb/utils/logger'

// Mock dotenv to prevent actual config loading during tests
jest.mock('dotenv', () => ({
  config: jest.fn(),
}))

// Mock the Google Auth Library
jest.mock('google-auth-library', () => ({
  OAuth2Client: jest.fn().mockImplementation(() => ({
    verifyIdToken: jest.fn().mockReturnValue(Promise.resolve({ getPayload: jest.fn() }))
  }))
}))
const mockOAuth2Client = OAuth2Client as jest.MockedClass<typeof OAuth2Client>

// Mock the logger
jest.mock('@sb/utils/logger', () => ({
  error: jest.fn(),
}))

// Load environment variables
dotenv.config()

describe('googleAuthenticate', () => {
  const googleToken = 'test-google-token'
  const mockClient = new OAuth2Client()
  const mockTicket = {
    getPayload: jest.fn(),
  }
  const mockPayload: TokenPayload = {
    sub: '1234567890',
    email: 'test@example.com',
    email_verified: true,
    name: 'Test User',
    iss: 'accounts.google.com',
    given_name: 'Test',
    family_name: 'User',
    locale: 'en',
    aud: 'test-client-id',
    iat: 1234567890,
    exp: 1234567890,
  }

  mockOAuth2Client.mockImplementation(() => mockClient)

  beforeEach(() => {
    jest.clearAllMocks()
    process.env.GOOGLE_CLIENT_ID = 'test-client-id'
    const mockVerifyIdToken = mockClient.verifyIdToken as jest.Mock
    mockVerifyIdToken.mockResolvedValue(mockTicket)
  })

  test('throws error if token is not provided', async () => {
    await expect(googleAuthenticate('')).rejects.toThrow('Token is required')
  })

  test('throws error if payload is null', async () => {
    const mockVerifyIdToken = mockClient.verifyIdToken as jest.Mock
    mockVerifyIdToken.mockResolvedValue({
      getPayload: () => null,
    })
    await expect(googleAuthenticate(googleToken)).rejects.toThrow('Unable to get payload from token')
  })

  test('returns payload if token is valid', async () => {
    const mockVerifyIdToken = mockClient.verifyIdToken as jest.Mock
    mockVerifyIdToken.mockResolvedValue({
      getPayload: () => mockPayload,
    })
    const result = await googleAuthenticate(googleToken)
    expect(result).toEqual(mockPayload)
  })

  test('logs and throws error if verifyIdToken throws an error with message', async () => {
    const error = new Error('Verification error')
    const mockVerifyIdToken = mockClient.verifyIdToken as jest.Mock
    mockVerifyIdToken.mockRejectedValue(error)

    await expect(googleAuthenticate(googleToken)).rejects.toThrow('Verification error')
    expect(logger.error).toHaveBeenCalledWith('Verification error', error)
  })

  test('logs and throws error if verifyIdToken throws an error without message', async () => {
    const error = new Error() // Proper Error object without message
    const mockVerifyIdToken = mockClient.verifyIdToken as jest.Mock
    mockVerifyIdToken.mockRejectedValue(error)

    await expect(googleAuthenticate(googleToken)).rejects.toThrow()
    expect(logger.error).toHaveBeenCalledWith('Error verifying googleToken', error)
  })
})
