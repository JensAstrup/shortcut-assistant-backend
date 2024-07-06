import { Router } from 'express'

import authenticate from '@sb/controllers/users/authenticate'
import register from '@sb/controllers/users/register'


// NOTE that authentication middleware is applied *after* the usersRouter in src/app.ts
// This means that any routes defined in usersRouter will not be protected by the authMiddleware
const noAuthUsersRouter = Router()
noAuthUsersRouter.post('/register', register)
noAuthUsersRouter.post('/authenticate', authenticate)
export default noAuthUsersRouter
