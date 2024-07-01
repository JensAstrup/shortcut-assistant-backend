import { Request, Response } from 'express'

import registerUserFromGoogle from '@sb/controllers/users/utils/register'
import encrypt from '@sb/encryption/encrypt'
import User from '@sb/interfaces/User'
import { StatusCodes } from '@sb/types/status-codes'
import logger from '@sb/utils/logger'


interface IncomingRegisterRequest extends Request {
    body: Partial<User>
}

async function register(request: IncomingRegisterRequest, response: Response): Promise<void> {
  try {
    const user = await registerUserFromGoogle(request)
    if (user instanceof Error) {
      response.status(StatusCodes.BAD_REQUEST).json({ errors: user.format() })
      return
    }
    const encryptedKey = encrypt(user.shortcutApiToken)
    response.status(StatusCodes.CREATED).json({ id: user.id, key: encryptedKey })
  }
  catch (e) {
    if (e instanceof Error) {
      logger.error(e.message)
      response.status(StatusCodes.SERVER_ERROR).json({ error: 'A server error occurred' })
    }
    else {
      logger.error(`An unknown error occurred: ${e}`)
      response.status(StatusCodes.SERVER_ERROR).json({ error: 'An unknown error occurred' })
    }
  }
}

export default register
export type { IncomingRegisterRequest }
