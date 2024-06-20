import { Request, Response } from 'express'

import registerUserFromGoogle from '@sb/controllers/users/utils/register'
import { StatusCodes } from '@sb/types/status-codes'
import logger from '@sb/utils/logger'


async function register(request: Request, response: Response): Promise<void> {
  const userInfo = request.body as Record<string, string>

  try {
    const user = await registerUserFromGoogle(userInfo)
    if (user instanceof Error) {
      response.status(StatusCodes.BAD_REQUEST).json({ errors: user.format() })
      return
    }
    response.status(StatusCodes.OK).send({ user })
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
