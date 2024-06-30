import { AES } from 'crypto-js'

import decrypt from '@sb/encryption/decrypt'


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
  it('should return an decrypted string', () => {
    const data = 'test-data'
    process.env.ENCRYPTION_KEY = 'test-key'
    const decryptMock = AES.decrypt as jest.Mock
    decryptMock.mockReturnValue({ toString: jest.fn().mockReturnValue('decrypted-data') })
    const result = decrypt(data)
    expect(result).toEqual('decrypted-data')
  })
})
