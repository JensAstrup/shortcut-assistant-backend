import { Request, Response } from 'express'
import { Logger } from 'winston'
import { ZodError, ZodIssue } from 'zod'

import register, { IncomingRegisterRequest } from '@sb/controllers/users/register'
import registerUserFromGoogle from '@sb/controllers/users/utils/register'
import encrypt from '@sb/encryption/encrypt'
import { User } from '@sb/entities/User'
import { StatusCodes } from '@sb/types/status-codes'
import logger from '@sb/utils/logger'


jest.mock('@sb/controllers/users/utils/register', () => jest.fn())
jest.mock('@sb/utils/logger')
jest.mock('@sb/controllers/users/utils/register')
jest.mock('@sb/controllers/users/utils/google-authenticate')
jest.mock('@sb/encryption/encrypt')
const mockLogger = logger as jest.Mocked<Logger>
const mockRegisterUserFromGoogle = registerUserFromGoogle as jest.MockedFunction<typeof registerUserFromGoogle>
const mockEncrypt = encrypt as jest.MockedFunction<typeof encrypt>


describe('register', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should return a 200 response with the user if registration is successful', async () => {
    mockRegisterUserFromGoogle.mockResolvedValueOnce({ id: 123, shortcutApiToken: 'test-token' } as unknown as User)
    mockEncrypt.mockReturnValueOnce('encrypted-token')
    const request = { body: { email: '' } } as unknown as Request
    const response = { status: jest.fn().mockReturnThis(), json: jest.fn() } as unknown as Response
    await register(request, response)
    expect(response.status).toHaveBeenCalledWith(StatusCodes.CREATED)
    expect(response.json).toHaveBeenCalledWith({ id: 123, key: 'encrypted-token' })
  })

  it('should return a 400 status with errors if registration fails', async () => {
    const error = new ZodError([{ message: 'Invalid email', fatal: true } as ZodIssue])
    error.format = jest.fn().mockReturnValue('formatted error')
    error.name = 'ZodError'
    mockRegisterUserFromGoogle.mockResolvedValueOnce(error)
    const request = { body: { email: '' } } as unknown as Request
    const response = { status: jest.fn().mockReturnThis(), json: jest.fn() } as unknown as Response
    await register(request, response)
    expect(response.status).toHaveBeenCalledWith(StatusCodes.BAD_REQUEST)
    expect(response.json).toHaveBeenCalledWith({ errors: 'formatted error' })
  })

  it('should return a 500 status if an unknown error occurs', async () => {
    mockRegisterUserFromGoogle.mockRejectedValueOnce(new Error('Unknown error'))

    const request = { body: { email: '' } } as unknown as Request
    const response = { status: jest.fn().mockReturnThis(), json: jest.fn() } as unknown as Response
    await expect(register(request, response)).resolves.toBeUndefined()
    expect(response.status).toHaveBeenCalledWith(StatusCodes.SERVER_ERROR)
    expect(response.json).toHaveBeenCalledWith({ error: 'A server error occurred' })
    expect(mockLogger.error).toHaveBeenCalledWith('Unknown error')
  })

  it('should return a 500 status if an unknown non-error occurs', async () => {
    mockRegisterUserFromGoogle.mockRejectedValue('Test error')

    const request = { body: { email: '' } } as IncomingRegisterRequest
    const response = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response

    await expect(register(request, response)).resolves.toBeUndefined()
    expect(response.status).toHaveBeenCalledWith(StatusCodes.SERVER_ERROR)
    expect(response.json).toHaveBeenCalledWith({ error: 'An unknown error occurred' })
    expect(mockLogger.error).toHaveBeenCalledWith('An unknown error occurred: Test error')
  })
})
