import ConfigurationError from '@sb/errors/configuration'


describe('ConfigurationError', () => {
  it('should have a message of "ENCRYPTION_KEY is required"', () => {
    const error = new ConfigurationError('ENCRYPTION_KEY is required')
    expect(error.message).toBe('ENCRYPTION_KEY is required')
  })
})
