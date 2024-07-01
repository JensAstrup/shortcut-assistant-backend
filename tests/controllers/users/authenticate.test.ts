import { Response } from 'express'

import authenticate, { IncomingAuthenticateRequest } from '@sb/controllers/users/authenticate'
import getUser from '@sb/controllers/users/utils/get-user'
import encrypt from '@sb/encryption/encrypt'
import UserDoesNotExistError from '@sb/errors/user-does-not-exist'
import { StatusCodes } from '@sb/types/status-codes'


jest.mock('@sb/controllers/users/utils/get-user')
jest.mock('@sb/encryption/encrypt')
const mockEncrypt = encrypt as jest.Mock


describe('authenticate', () => {
  it('should return a 200 if the user is found', async () => {
    const mockGetUser = getUser as jest.Mock
    mockGetUser.mockResolvedValue({ id: '123' })
    mockEncrypt.mockReturnValue('encrypted-token')

    const request = { get: jest.fn().mockReturnValue('Bearer token') } as unknown as IncomingAuthenticateRequest
    const response = { status: jest.fn().mockReturnThis(), json: jest.fn() } as unknown as Response
    await authenticate(request, response)
    expect(response.status).toHaveBeenCalledWith(StatusCodes.OK)
    expect(response.json).toHaveBeenCalledWith({ id: '123', key: 'encrypted-token' })
  })

  it('should return a 404 if the user is not found', async () => {
    const mockGetUser = getUser as jest.Mock
    mockGetUser.mockRejectedValue(new UserDoesNotExistError())

    const request = { get: jest.fn().mockReturnValue('Bearer token') } as unknown as IncomingAuthenticateRequest
    const response = { status: jest.fn().mockReturnThis(), json: jest.fn() } as unknown as Response
    await authenticate(request, response)
    expect(response.status).toHaveBeenCalledWith(StatusCodes.NOT_FOUND)
    expect(response.json).toHaveBeenCalledWith({ error: 'User not found' })
  })

  it('should return a 500 if an unknown error occurs', async () => {
    const mockGetUser = getUser as jest.Mock
    mockGetUser.mockRejectedValue(new Error('Unknown error'))

    const request = { get: jest.fn().mockReturnValue('Bearer token') } as unknown as IncomingAuthenticateRequest
    const response = { status: jest.fn().mockReturnThis(), json: jest.fn() } as unknown as Response
    await authenticate(request, response)
    expect(response.status).toHaveBeenCalledWith(StatusCodes.SERVER_ERROR)
    expect(response.json).toHaveBeenCalledWith({ error: 'A server error occurred' })
  })

  it('should return a 500 if an unknown non-error occurs', async () => {
    const mockGetUser = getUser as jest.Mock
    mockGetUser.mockRejectedValue('Test error')

    const request = { get: jest.fn().mockReturnValue('Bearer token') } as unknown as IncomingAuthenticateRequest
    const response = { status: jest.fn().mockReturnThis(), json: jest.fn() } as unknown as Response
    await authenticate(request, response)
    expect(response.status).toHaveBeenCalledWith(StatusCodes.SERVER_ERROR)
    expect(response.json).toHaveBeenCalledWith({ error: 'An unknown error occurred' })
  })
})
