import { OAuth2Client } from 'google-auth-library'

import googleAuthenticate from '@sb/controllers/users/utils/google-authenticate'
import UserDoesNotExistError from '@sb/errors/user-does-not-exist'
import logger from '@sb/utils/logger'


jest.mock('google-auth-library', () => {
  const mOAuth2Client = {
    verifyIdToken: jest.fn().mockResolvedValue({
      getPayload: jest.fn().mockReturnValue({ sub: 'test-sub' })
    })
  }
  return { OAuth2Client: jest.fn(() => mOAuth2Client) }
})

const mockOAuth2Client = OAuth2Client as jest.MockedClass<typeof OAuth2Client>


describe('googleAuthenticate', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })
  it('should throw an error if token is missing', async () => {
    await expect(googleAuthenticate('')).rejects.toThrow('Token is required')
  })

  it('should throw an error if payload is missing', async () => {
    await expect(googleAuthenticate('test-token')).rejects.toThrow('Unable to get payload from token')
  })

  it('should return the sub from the payload', async () => {
    const result = await googleAuthenticate('test-token')
    expect(result).toBe('test-sub')
  })

  it('should log an error if the error has a message', async () => {
    const spyLogger = jest.spyOn(logger, 'error')
    await expect(googleAuthenticate('test-token')).rejects.toThrow('Error verifying googleToken')
    expect(spyLogger).toHaveBeenCalledWith('test-error', new Error('test-error'))
    spyLogger.mockRestore()
  })

  it('should log an error if the error does not have a message', async () => {
    jest.spyOn(logger, 'error')
    // @ts-expect-error mockOAuth2Client is a mock
    mockOAuth2Client.mockImplementation(() => {
      jest.fn().mockResolvedValue({
        getPayload: jest.fn().mockRejectedValue(new UserDoesNotExistError())
      })
    }
    )
    await expect(googleAuthenticate('test-token')).rejects.toThrow('Error verifying googleToken')
  })
})
