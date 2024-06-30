import { Request } from 'express'
import { ZodError, z } from 'zod'

import googleAuthenticate from '@sb/controllers/users/utils/google-authenticate'
import database from '@sb/db'
import { User } from '@sb/entities/User'
import UserInterface from '@sb/interfaces/User'


const ZodUser = z.object({
  shortcutApiToken: z.string(),
})


async function registerUserFromGoogle(request: Request): Promise<User | ZodError> {
  const userInfo = request.body

  const userResult = ZodUser.safeParse(userInfo)
  const authenticatedPayload = await googleAuthenticate(request.headers.authorization!)
  if (!userResult.success) {
    return userResult.error
  }
  const newUser: UserInterface = {
    googleId: authenticatedPayload.sub,
    email: authenticatedPayload.email || '',
    name: authenticatedPayload.name || '',
    shortcutApiToken: userResult.data.shortcutApiToken,
    googleAuthToken: request.headers.authorization!,
  }
  return await database.manager.save(User, newUser)
}

export default registerUserFromGoogle
