import { Request } from 'express'
import { TokenPayload } from 'google-auth-library'
import { ZodError, z } from 'zod'

import googleAuthenticate from '@sb/controllers/users/utils/google-authenticate'
import database from '@sb/db'
import { User } from '@sb/entities/User'
import UserInterface from '@sb/interfaces/User'


const ZodUser = z.object({
  shortcutApiToken: z.string(),
  googleToken: z.string(),
})


async function registerUserFromGoogle(request: Request): Promise<User | ZodError> {
  let authenticatedPayload: TokenPayload
  const userInfo = request.body

  try {
    authenticatedPayload = await googleAuthenticate(<string>request.headers.Authorization)
  }
  catch (error) {
    if (error instanceof Error) {
      throw error
    }
  }

  const userResult = ZodUser.safeParse(userInfo)
  if (!userResult.success) {
    return userResult.error
  }
  const newUser: UserInterface = {
    googleId: authenticatedPayload!.sub,
    email: authenticatedPayload!.email || '',
    name: authenticatedPayload!.name || '',
    shortcutApiToken: userResult.data.shortcutApiToken,
    googleAuthToken: userResult.data.googleToken,
  }
  return await database.manager.save(User, newUser)
}

export default registerUserFromGoogle
