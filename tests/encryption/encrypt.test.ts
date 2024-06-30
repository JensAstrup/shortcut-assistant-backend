import { AES } from 'crypto-js'

import encrypt from '@sb/encryption/encrypt'


jest.mock('crypto-js', () => {
  return {
    AES: {
      encrypt: jest.fn().mockReturnValue({ toString: jest.fn() })
    }
  }
})

describe('encrypt', () => {
  it('should return an encrypted string', () => {
    const data = 'test-data'
    process.env.ENCRYPTION_KEY = 'test-key'
    const encryptMock = AES.encrypt as jest.Mock
    encryptMock.mockReturnValue({ toString: jest.fn().mockReturnValue('encrypted-data') })
    const result = encrypt(data)
    expect(result).toEqual('encrypted-data')
  })
})
