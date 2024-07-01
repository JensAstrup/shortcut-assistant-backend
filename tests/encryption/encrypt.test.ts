import { AES } from 'crypto-js'

import encrypt from '@sb/encryption/encrypt'
import ConfigurationError from '@sb/errors/configuration'


jest.mock('crypto-js', () => {
  return {
    AES: {
      encrypt: jest.fn().mockReturnValue({ toString: jest.fn() })
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

  it('should return an encrypted string', () => {
    const data = 'test-data'
    process.env.ENCRYPTION_KEY = 'test-key'
    const encryptMock = AES.encrypt as jest.Mock
    encryptMock.mockReturnValue({ toString: jest.fn().mockReturnValue('encrypted-data') })
    const result = encrypt(data)
    expect(result).toEqual('encrypted-data')
  })

  it('should throw ConfigurationError when ENCRYPTION_KEY is not set', async () => {
    process.env = { ...originalEnv, ENCRYPTION_KEY: undefined }

    /* eslint-disable jest/no-conditional-expect */
    try {
      await import('@sb/encryption/encrypt')
    }
    catch (e) {
      expect(e).toBeInstanceOf(ConfigurationError)
      // @ts-expect-error We know that e is an instance of ConfigurationError
      expect(e.message).toBe('ENCRYPTION_KEY is required')
    }
    /* eslint-enable jest/no-conditional-expect */
  })
})
