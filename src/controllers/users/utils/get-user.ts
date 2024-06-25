import database from '@sb/db'
import { User } from '@sb/entities/User'


async function getUser(googleId: string): Promise<User | null> {
  const userRepository = database.getRepository(User)
  return userRepository.findOneBy({ googleId: googleId })
}

export default getUser
