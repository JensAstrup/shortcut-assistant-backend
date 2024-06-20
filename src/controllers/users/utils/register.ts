import { ZodError, ZodType, z } from 'zod'

import database from '@sb/db'
import { User } from '@sb/entities/User'
import UserInterface from '@sb/interfaces/User'


const ZodUser = z.object({
  name: z.string(),
  email: z.string().email(),
  shortcutApiToken: z.string(),
  googleId: z.string(),
}) satisfies ZodType<UserInterface>


async function registerUserFromGoogle(userInfo: Record<string, string>): Promise<User | ZodError> {
  const userResult = ZodUser.safeParse(userInfo)
  if (!userResult.success) {
    return userResult.error
  }
  return await database.manager.save(User, userResult.data)
}

export default registerUserFromGoogle
