import { Logger } from 'winston'

import register from '@sb/controllers/users/register'
import registerUserFromGoogle from '@sb/controllers/users/utils/register'
import { StatusCodes } from '@sb/types/status-codes'
import logger from '@sb/utils/logger'


jest.mock('@sb/controllers/users/utils/register', () => jest.fn())
jest.mock('@sb/utils/logger')
jest.mock('@sb/controllers/users/utils/register', () => ({
  __esModule: true,
  default: jest.fn()
}))
const mockLogger = logger as jest.Mocked<Logger>
const mockRegisterUserFromGoogle = registerUserFromGoogle as jest.Mock


describe('register', () => {
  beforeEach(() => {
    jest.resetModules()
  })

  it('should return a 200 response with the user if registration is successful', async () => {
    mockRegisterUserFromGoogle.mockResolvedValueOnce({ email: '' })
    const request = { body: { email: '' } } as unknown as Request
    const response = { status: jest.fn().mockReturnThis(), send: jest.fn() }
    // @ts-expect-error request and response are mocked
    await register(request, response)
    expect(mockRegisterUserFromGoogle).toHaveBeenCalledWith({ email: '' })
    expect(mockLogger.error).not.toHaveBeenCalled()
    expect(response.status).toHaveBeenCalledWith(StatusCodes.OK)
    expect(response.send).toHaveBeenCalledWith({ user: { email: '' } })
  })

  it('should return a 500 status if an unknown error occurs', async () => {
    mockRegisterUserFromGoogle.mockRejectedValueOnce(new Error('Unknown error'))

    const request = { body: { email: '' } } as unknown as Request
    const response = { status: jest.fn().mockReturnThis(), json: jest.fn() }
    // @ts-expect-error request and response are mocked
    await register(request, response)
    expect(response.status).toHaveBeenCalledWith(StatusCodes.SERVER_ERROR)
    expect(response.json).toHaveBeenCalledWith({ error: 'A server error occurred' })
    expect(mockLogger.error).toHaveBeenCalledWith('Unknown error')
  })
})
