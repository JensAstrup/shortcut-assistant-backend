import { AES } from 'crypto-js'

import ConfigurationError from '@sb/errors/configuration'


const KEY = process.env.ENCRYPTION_KEY

if (KEY === undefined) {
  throw new ConfigurationError('ENCRYPTION_KEY is required')
}

function encrypt(data: string): string {
  return AES.encrypt(data, KEY!).toString()
}

export default encrypt
