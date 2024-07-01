import database from '@sb/db'
import { User } from '@sb/entities/User'
import UserDoesNotExistError from '@sb/errors/user-does-not-exist'


async function getUser(encryptedAuthorizationHeader: string): Promise<User> {
  const userRepository = database.getRepository(User)
  const user = await userRepository.findOne({ where: { shortcutApiToken: encryptedAuthorizationHeader } })

  if (!user) {
    throw new UserDoesNotExistError()
  }

  return user
}

export default getUser
