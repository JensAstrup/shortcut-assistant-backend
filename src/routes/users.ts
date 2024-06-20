import { Router } from 'express'

import register from '@sb/controllers/users/register'


const usersRouter = Router()
usersRouter.post('/register', register)

export default usersRouter
