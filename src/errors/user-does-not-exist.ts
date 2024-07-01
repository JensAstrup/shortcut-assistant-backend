class UserDoesNotExistError extends Error {
  constructor() {
    super('User does not exist')
    this.name = 'UserDoesNotExistError'
  }
}

export default UserDoesNotExistError
