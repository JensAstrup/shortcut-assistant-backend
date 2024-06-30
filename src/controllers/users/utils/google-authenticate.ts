import dotenv from 'dotenv'
import { OAuth2Client, TokenPayload } from 'google-auth-library'

import logger from '@sb/utils/logger'


dotenv.config()



async function googleAuthenticate(googleToken: string): Promise<TokenPayload> {
  const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID)

  if (!googleToken) {
    throw new Error ('Token is required')
  }

  try {
    const ticket = await client.verifyIdToken({
      idToken: googleToken,
      audience: process.env.GOOGLE_CLIENT_ID
    })

    const payload = ticket.getPayload()
    if (!payload) {
      throw new Error('Unable to get payload from token')
    }
    return payload
  }
  catch (error) {
    if (error instanceof Error && error.message) {
      logger.error(error.message, error)
      throw error
    }
    else {
      logger.error('Error verifying googleToken', error)
      throw error
    }
  }
}

export default googleAuthenticate
