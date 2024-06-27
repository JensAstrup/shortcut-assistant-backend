// Authenticate a user, creating them if they don't exist

import { Request, Response } from 'express'

import getUser from '@sb/controllers/users/utils/get-user'
import database from '@sb/db'
import { User } from '@sb/entities/User'
import UserDoesNotExistError from '@sb/errors/user-does-not-exist'
import user from '@sb/interfaces/User'
import { StatusCodes } from '@sb/types/status-codes'
import logger from '@sb/utils/logger'



interface IncomingAuthenticateRequest extends Request {
    body: Partial<User>
}

async function authenticate(request: IncomingAuthenticateRequest, response: Response): Promise<Response> {
  // Check for existing user in DB using google token from request authorization header
  try {
    const user = await getUser(request.get('Authorization')!)
    return response.status(StatusCodes.OK).json({ id: user.id })
  }
  catch (e) {
    if (e instanceof UserDoesNotExistError) {
      return response.status(StatusCodes.NOT_FOUND).json({ error: 'User not found' })
    }
    else if (e instanceof Error) {
      logger.error(e.message)
      return response.status(StatusCodes.SERVER_ERROR).json({ error: 'A server error occurred' })
    }
    else {
      logger.error(`An unknown error occurred: ${e}`)
      return response.status(StatusCodes.SERVER_ERROR).json({ error: 'An unknown error occurred' })
    }
  }
}

export default authenticate
