import googleAuthenticate from '@sb/controllers/users/utils/google-authenticate'
import database from '@sb/db'
import { User } from '@sb/entities/User'
import UserDoesNotExistError from '@sb/errors/user-does-not-exist'


async function getUser(googleAuthToken: string): Promise<User> {
  let user: User | null
  const userRepository = database.getRepository(User)
  user = await userRepository.findOne({ where: { googleAuthToken } })

  if (!user) {
    const userInfo = await googleAuthenticate(googleAuthToken)
    const googleUserId = userInfo.sub
    if (googleUserId) {
      user = await userRepository.findOne({ where: { googleId: googleUserId } })
      if (!user) {
        throw new UserDoesNotExistError()
      }
      else {
        user.googleAuthToken = googleAuthToken
        await userRepository.save(user)
      }
    }
    throw new UserDoesNotExistError()
  }

  return user
}

export default getUser
