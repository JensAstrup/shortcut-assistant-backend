describe('authMiddleware', () => {
  it('should return a 401 if the authorization header is missing', () => {
    const request = { headers: {} } as unknown as Request
    const response = { status: jest.fn().mockReturnThis(), json: jest.fn() } as unknown as Response
    const next = jest.fn()
    authMiddleware(request, response, next)
    expect(response.status).toHaveBeenCalledWith(StatusCodes.UNAUTHORIZED)
    expect(response.json).toHaveBeenCalledWith({ message: 'Authorization header is required' })
    expect(next).not.toHaveBeenCalled()
  })
  it('should call next if the authorization header is present', () => {
    const request = { headers: { authorization: 'Bearer token' } } as unknown as Request
    const response = { status: jest.fn().mockReturnThis(), json: jest.fn() } as unknown as Response
    const next = jest.fn()
    authMiddleware(request, response, next)
    expect(next).toHaveBeenCalled()
  })
})
