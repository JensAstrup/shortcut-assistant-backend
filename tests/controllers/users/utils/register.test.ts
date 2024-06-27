import { Request } from 'express'
import { ZodError } from 'zod'

import googleAuthenticate from '@sb/controllers/users/utils/google-authenticate'
import registerUserFromGoogle from '@sb/controllers/users/utils/register'
import database from '@sb/db'
import { User } from '@sb/entities/User'


jest.mock('@sb/db', () => ({
  manager: {
    save: jest.fn(),
  },
}))

jest.mock('@sb/controllers/users/utils/google-authenticate', () => jest.fn())
const mockGoogleAuthenticate = googleAuthenticate as jest.Mock


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
      name: 'John Doe',
      email: 'invalid-email', // invalid email
      shortcutApiToken: 'sometoken',
      googleId: 'google123',
    }

    const headers = { Authorization: '213' }

    const request = { body: invalidUserInfo, headers } as unknown as Request
    const result = await registerUserFromGoogle(request)
    expect(result).toBeInstanceOf(ZodError)
  })

  it('should save the user to the database if userInfo is valid', async () => {
    (database.manager.save as jest.Mock).mockResolvedValue(mockUser)
    const validUserInfo = {
      name: 'John Doe',
      email: 'john.doe@example.com', // invalid email
      shortcutApiToken: 'sometoken',
      googleAuthToken: 'google123',
    }

    mockGoogleAuthenticate.mockResolvedValue({ sub: 'google321', email: 'john.doe@example.com', name: 'John Doe' })

    const request = { body: validUserInfo, headers: { Authorization: '213' } } as unknown as Request
    const result = await registerUserFromGoogle(request)
    expect(result).toEqual(mockUser)
    expect(database.manager.save).toHaveBeenCalledWith(User, mockUser)
  })
})
