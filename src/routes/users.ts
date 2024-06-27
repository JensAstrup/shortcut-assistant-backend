import { Router } from 'express'

import authenticate from '@sb/controllers/users/authenticate'
import register from '@sb/controllers/users/register'


const usersRouter = Router()
usersRouter.post('/register', register)
usersRouter.post('/authenticate', authenticate)
export default usersRouter
