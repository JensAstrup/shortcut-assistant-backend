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

    const result = await registerUserFromGoogle(invalidUserInfo)
    expect(result).toBeInstanceOf(ZodError)
  })

  it('should save the user to the database if userInfo is valid', async () => {
    (database.manager.save as jest.Mock).mockResolvedValue(mockUser)

    const result = await registerUserFromGoogle(mockUser)
    expect(result).toEqual(mockUser)
    expect(database.manager.save).toHaveBeenCalledWith(User, mockUser)
  })
})
