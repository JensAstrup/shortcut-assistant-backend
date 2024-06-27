import ConfigurationError from '@sb/errors/configuration'


const KEY = process.env.ENCRYPTION_KEY

if (!KEY) {
  throw new ConfigurationError('ENCRYPTION_KEY is required')
}

function decrypt(data: string): string {
  const bytes = CryptoJS.AES.decrypt(data, KEY!)
  return bytes.toString(CryptoJS.enc.Utf8)
}

export default decrypt
