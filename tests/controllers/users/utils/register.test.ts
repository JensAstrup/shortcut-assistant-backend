import { Request } from 'express'
import { ZodError } from 'zod'

import googleAuthenticate, { GoogleUserInfo } from '@sb/controllers/users/utils/google-authenticate'
import registerUserFromGoogle from '@sb/controllers/users/utils/register'
import database from '@sb/db'
import encrypt from '@sb/encryption/encrypt'
import { User } from '@sb/entities/User'


jest.mock('@sb/encryption/encrypt')
const mockEncrypt = encrypt as jest.Mock

jest.mock('@sb/db', () => ({
  manager: {
    save: jest.fn(),
  },
}))

jest.mock('@sb/controllers/users/utils/google-authenticate', () => jest.fn())
const mockGoogleAuthenticate = googleAuthenticate as jest.MockedFunction<typeof googleAuthenticate>


describe('registerUserFromGoogle', () => {
  const mockUser = {
    name: 'John Doe',
    email: 'john.doe@example.com',
    shortcutApiToken: 'sometoken',
    googleAuthToken: 'google123',
    googleId: 'google321',
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should return a ZodError if userInfo is invalid', async () => {
    const invalidUserInfo = {
      shortcut: 'sometoken',
    }

    const headers = { authorization: '213' }
    const request = { body: invalidUserInfo, headers } as unknown as Request
    const result = await registerUserFromGoogle(request)
    expect(result).toBeInstanceOf(ZodError)
  })

  it('should save the user to the database if userInfo is valid', async () => {
    const mockSave = database.manager.save as jest.Mock
    mockSave.mockResolvedValue(mockUser)
    const validUserInfo = {
      name: 'John Doe',
      email: 'john.doe@example.com', // invalid email
      shortcutApiToken: 'sometoken',
      googleAuthToken: 'google123',
    }

    mockEncrypt.mockReturnValue('encrypted-token')

    const expectedSaveData = {
      ...mockUser,
      shortcutApiToken: 'encrypted-token',
    }
    const googleUser = {
      sub: 'google321',
      email: 'john.doe@example.com',
      name: 'John Doe' } as GoogleUserInfo
    mockGoogleAuthenticate.mockResolvedValue(googleUser)

    const request = { body: validUserInfo, headers: { authorization: '213' } } as unknown as Request
    const result = await registerUserFromGoogle(request)
    expect(result).toEqual(mockUser)
    expect(database.manager.save).toHaveBeenCalledWith(User, expectedSaveData)
  })
})
