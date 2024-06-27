import { Request } from 'express'
import { ZodError } from 'zod'

import registerUserFromGoogle from '@sb/controllers/users/utils/register'
import database from '@sb/db'
import { User } from '@sb/entities/User'


jest.mock('@sb/db', () => ({
  manager: {
    save: jest.fn(),
  },
}))

describe('registerUserFromGoogle', () => {
  const mockUser = {
    name: 'John Doe',
    email: 'john.doe@example.com',
    shortcutApiToken: 'sometoken',
    googleId: 'google123',
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

    const request = { body: invalidUserInfo } as unknown as Request
    const result = await registerUserFromGoogle(request)
    expect(result).toBeInstanceOf(ZodError)
  })

  it('should save the user to the database if userInfo is valid', async () => {
    (database.manager.save as jest.Mock).mockResolvedValue(mockUser)
    const validUserInfo = {
      name: 'John Doe',
      email: 'valid-email@email.com', // invalid email
      shortcutApiToken: 'sometoken',
      googleAuthToken: 'google123',
    }
    const request = { body: validUserInfo, heaaders: { Authorization: '213' } } as unknown as Request
    const result = await registerUserFromGoogle(request)
    expect(result).toEqual(mockUser)
    expect(database.manager.save).toHaveBeenCalledWith(User, mockUser)
  })
})
