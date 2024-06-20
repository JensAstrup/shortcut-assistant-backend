import database from '@sb/db'
import { User } from '@sb/entities/User'


async function registerUser(userInfo: Record<string, string>, token: string): Promise<void> {
  const user = new User()
  user.email = userInfo.email
  user.name = userInfo.name
  user.googleId = userInfo.id
  user.shortcutApiToken = ''
  await database.manager.save(user)
}
