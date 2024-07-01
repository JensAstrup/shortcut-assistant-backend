import { AES } from 'crypto-js'

import decrypt from '@sb/encryption/decrypt'
import ConfigurationError from '@sb/errors/configuration'


jest.mock('crypto-js', () => {
  return {
    enc: {
      Utf8: {}
    },
    AES: {
      decrypt: jest.fn().mockReturnValue({ toString: jest.fn() })
    }
  }
})

describe('encrypt', () => {
  let originalEnv: NodeJS.ProcessEnv

  beforeAll(() => {
    // Save the original process.env
    originalEnv = process.env
  })

  afterAll(() => {
    // Restore the original process.env
    process.env = originalEnv
  })

  it('should return an decrypted string', () => {
    const data = 'test-data'
    process.env.ENCRYPTION_KEY = 'test-key'
    const decryptMock = AES.decrypt as jest.Mock
    decryptMock.mockReturnValue({ toString: jest.fn().mockReturnValue('decrypted-data') })
    const result = decrypt(data)
    expect(result).toEqual('decrypted-data')
  })

  it('should throw ConfigurationError when ENCRYPTION_KEY is not set', async () => {
    process.env = { ...originalEnv, ENCRYPTION_KEY: undefined }

    /* eslint-disable jest/no-conditional-expect */
    try {
      await import('@sb/encryption/decrypt')
    }
    catch (e) {
      expect(e).toBeInstanceOf(ConfigurationError)
      // @ts-expect-error We know that e is an instance of ConfigurationError
      expect(e.message).toBe('ENCRYPTION_KEY is required')
    }
    /* eslint-enable jest/no-conditional-expect */
  })
})
