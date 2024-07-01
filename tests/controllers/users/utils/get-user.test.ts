import { Repository } from 'typeorm'

import getUser from '@sb/controllers/users/utils/get-user'
import googleAuthenticate from '@sb/controllers/users/utils/google-authenticate'
import database from '@sb/db'
import { User } from '@sb/entities/User'
import UserDoesNotExistError from '@sb/errors/user-does-not-exist'


jest.mock('@sb/controllers/users/utils/google-authenticate', () => jest.fn())


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

  it('should throw an error if the user does not exist', async () => {
    const googleId = 'test-google-id'
    const mockUserRepository = {
      findOne: jest.fn().mockResolvedValueOnce(null).mockResolvedValueOnce(null),
      save: jest.fn(),
    } as unknown as Repository<User>

    (database.getRepository as jest.Mock).mockReturnValue(mockUserRepository);
    (googleAuthenticate as jest.Mock).mockResolvedValue({ sub: googleId })

    const googleAuthToken = 'test-google-id-2'
    await expect(getUser(googleAuthToken)).rejects.toThrow(UserDoesNotExistError)
    expect(googleAuthenticate).toHaveBeenCalledWith(googleAuthToken)
    expect(mockUserRepository.findOne).toHaveBeenCalledTimes(2)
    expect(mockUserRepository.findOne).toHaveBeenCalledWith({ where: { googleAuthToken } })
    expect(mockUserRepository.findOne).toHaveBeenCalledWith({ where: { googleId: googleId } })
  })
})
