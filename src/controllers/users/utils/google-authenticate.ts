import logger from '@sb/utils/logger'


interface GoogleUserInfo {
    email: string
    email_verified: boolean
    family_name: string
    given_name: string
    locale: string
    name: string
    picture: string
    sub: string
}


async function googleAuthenticate(token: string): Promise<GoogleUserInfo> {
  try {
    const userInfoResponse = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    if (!userInfoResponse.ok) {
      logger.error('Failed to fetch user info', userInfoResponse.status)
      throw new Error('Failed to fetch user info')
    }

    const userInfo = await userInfoResponse.json()
    return userInfo as GoogleUserInfo
  }
  catch (error) {
    if (error instanceof Error && error.message) {
      logger.error(error.message, error)
      throw error
    }
    else {
      logger.error('Error verifying token', error)
      throw error
    }
  }
}

export default googleAuthenticate
export type { GoogleUserInfo }
