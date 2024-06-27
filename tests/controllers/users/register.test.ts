import { Logger } from 'winston'

import registerUserFromGoogle from '@sb/controllers/users/utils/register'
import { StatusCodes } from '@sb/types/status-codes'
import logger from '@sb/utils/logger'


jest.mock('@sb/controllers/users/utils/register', () => jest.fn())
jest.mock('@sb/utils/logger')
jest.mock('@sb/controllers/users/utils/register')
jest.mock('@sb/controllers/users/utils/google-authenticate')
jest.mock('@sb/encryption/encrypt', () => ({
  encrypt: jest.fn().mockResolvedValue('encrypted-token')
}))
const mockLogger = logger as jest.Mocked<Logger>
const mockRegisterUserFromGoogle = registerUserFromGoogle as jest.Mock


describe('register', () => {
  beforeEach(() => {
    jest.resetModules()
  })

  it('should return a 200 response with the user if registration is successful', async () => {
    const request = { body: { email: '' } } as unknown as Request
    // @ts-expect-error request and response are mocked
    const token = await registerUserFromGoogle(request)
    expect(token).toBe('encrypted-token')
  })

  it('should return a 500 status if an unknown error occurs', async () => {
    mockRegisterUserFromGoogle.mockRejectedValueOnce(new Error('Unknown error'))

    const request = { body: { email: '' } } as unknown as Request
    const response = { status: jest.fn().mockReturnThis(), json: jest.fn() }
    // @ts-expect-error request and response are mocked
    await registerUserFromGoogle(request)
    expect(response.status).toHaveBeenCalledWith(StatusCodes.SERVER_ERROR)
    expect(response.json).toHaveBeenCalledWith({ error: 'A server error occurred' })
    expect(mockLogger.error).toHaveBeenCalledWith('Unknown error')
  })

  it('should return a 500 status if an unknown non-error occurs', async () => {
    mockRegisterUserFromGoogle.mockRejectedValueOnce('Test error')

    const request = { body: { email: '' } } as unknown as Request
    const response = { status: jest.fn().mockReturnThis(), json: jest.fn() }
    // @ts-expect-error request and response are mocked
    await registerUserFromGoogle(request)
    expect(response.status).toHaveBeenCalledWith(StatusCodes.SERVER_ERROR)
    expect(response.json).toHaveBeenCalledWith({ error: 'An unknown error occurred' })
    expect(mockLogger.error).toHaveBeenCalledWith('An unknown error occurred: Test error')
  })
})
