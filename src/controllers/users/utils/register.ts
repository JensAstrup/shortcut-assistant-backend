import { Request } from 'express'
import { ZodError, z } from 'zod'

import googleAuthenticate from '@sb/controllers/users/utils/google-authenticate'
import database from '@sb/db'
import encrypt from '@sb/encryption/encrypt'
import { User } from '@sb/entities/User'
import UserInterface from '@sb/interfaces/User'


const ZodUser = z.object({
  shortcutApiToken: z.string(),
  googleAuthToken: z.string(),
})


async function registerUserFromGoogle(request: Request): Promise<User | ZodError> {
  const userInfo = request.body

  const userResult = ZodUser.safeParse(userInfo)
  const authenticatedPayload = await googleAuthenticate(request.headers.authorization!)
  if (!userResult.success) {
    return userResult.error
  }

  const shortcutApiToken: string = userResult.data.shortcutApiToken
  const encryptedToken = encrypt(shortcutApiToken)

  const newUser: UserInterface = {
    googleId: authenticatedPayload.sub,
    email: authenticatedPayload.email || '',
    name: authenticatedPayload.name || '',
    shortcutApiToken: encryptedToken,
    googleAuthToken: userResult.data.googleAuthToken,
  }
  return await database.manager.save(User, newUser)
}

export default registerUserFromGoogle
