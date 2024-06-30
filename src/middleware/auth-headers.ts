import { NextFunction, Request, Response } from 'express'

import { StatusCodes } from '@sb/types/status-codes'


function authMiddleware(request: Request, response: Response, next: NextFunction): Response | void {
  const authHeader = request.headers.authorization
  if (!authHeader) {
    return response.status(StatusCodes.UNAUTHORIZED).json({ message: 'Authorization header is required' })
  }
  next()
}

export default authMiddleware
