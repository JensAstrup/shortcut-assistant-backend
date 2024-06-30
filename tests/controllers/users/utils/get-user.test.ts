import { Repository } from 'typeorm'

import getUser from '@sb/controllers/users/utils/get-user'
import { User } from '@sb/entities/User'


jest.mock('@sb/db', () => {
  const mockUser = {
    googleId: 'test-google-id',
    name: 'test-name',
    email: 'test-email',
    shortcutApiToken: 'test-token'
  } as User
  const mockUserRepository = {
    findOne: jest.fn().mockResolvedValue(mockUser)
  } as unknown as Repository<User>

  const mockDatabase = {
    getRepository: jest.fn().mockReturnValue(mockUserRepository)
  }
  return { getRepository: mockDatabase.getRepository, database: mockDatabase }
})


describe('getUser', () => {
  beforeEach(async () => {
  })

  it('should return a user', async () => {
    const googleId = 'test-google-id'
    const user = await getUser(googleId)

    expect(user).toEqual({
      googleId: 'test-google-id',
      name: 'test-name',
      email: 'test-email',
      shortcutApiToken: 'test-token'
    })
  })
})
