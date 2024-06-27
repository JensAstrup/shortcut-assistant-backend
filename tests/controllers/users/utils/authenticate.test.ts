import { OAuth2Client } from 'google-auth-library'

import googleAuthenticate from '@sb/controllers/users/utils/google-authenticate'
import logger from '@sb/utils/logger'


describe('authenticate', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })
  it('should throw an error if token is missing', async () => {
    await expect(googleAuthenticate('')).rejects.toThrow('Token is required')
  })

  it('should throw an error if payload is missing', async () => {
    const mockVerifyIdToken = jest.fn().mockImplementation(() => Promise.resolve({
      getPayload: () => null
    }))
    const spy = jest.spyOn(OAuth2Client.prototype, 'verifyIdToken').mockImplementation(mockVerifyIdToken)
    await expect(googleAuthenticate('test-token')).rejects.toThrow('Unable to get payload from token')
    spy.mockRestore()
  })

  it('should return the sub from the payload', async () => {
    const mockVerifyIdToken = jest.fn().mockImplementation(() => Promise.resolve({
      getPayload: () => ({ sub: 'test-sub' })
    }))
    const spy = jest.spyOn(OAuth2Client.prototype, 'verifyIdToken').mockImplementation(mockVerifyIdToken)
    const result = await googleAuthenticate('test-token')
    expect(result).toBe('test-sub')
    spy.mockRestore()
  })

  it('should log an error if the error has a message', async () => {
    const mockVerifyIdToken = jest.fn().mockImplementation(() => Promise.reject(new Error('test-error')))
    // @ts-expect-error - mockImplementation is not in the types
    const spy = jest.spyOn(OAuth2Client.prototype, 'verifyIdToken').mockResolvedValue(mockVerifyIdToken)
    const spyLogger = jest.spyOn(logger, 'error')
    await expect(googleAuthenticate('test-token')).rejects.toThrow('Error verifying googleToken')
    expect(spyLogger).toHaveBeenCalledWith('test-error', new Error('test-error'))
    spy.mockRestore()
    spyLogger.mockRestore()
  })

  it('should log an error if the error does not have a message', async () => {
    const mockVerifyIdToken = jest.fn().mockRejectedValue({})
    // @ts-expect-error - mockImplementation is not in the types
    jest.spyOn(OAuth2Client.prototype, 'verifyIdToken').mockResolvedValue(mockVerifyIdToken)
    jest.spyOn(logger, 'error')
    await expect(googleAuthenticate('test-token')).rejects.toThrow('Error verifying googleToken')
  })
})
