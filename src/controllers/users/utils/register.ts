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
  const requestBody: { shortcutApiToken: string, googleAuthToken: string } = request.body

  const userResult = ZodUser.safeParse(requestBody)
  const authenticatedPayload = await googleAuthenticate(requestBody.googleAuthToken)
  if (!userResult.success) {
    return userResult.error
  }
  const existingUser = await database.getRepository(User).findOne({
    where: { googleId: authenticatedPayload.sub },
  })

  if (existingUser) {
    existingUser.shortcutApiToken = encrypt(requestBody.shortcutApiToken)
    return await database.manager.save(User, existingUser)
  }
  else {
    const newUser: UserInterface = {
      googleId: authenticatedPayload.sub,
      email: authenticatedPayload.email || '',
      name: authenticatedPayload.name || '',
      shortcutApiToken: encrypt(requestBody.shortcutApiToken),
      googleAuthToken: requestBody.googleAuthToken,
    }
    return await database.manager.save(User, newUser)
  }
}

export default registerUserFromGoogle
