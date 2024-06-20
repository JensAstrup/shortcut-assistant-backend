import '@sb/utils/sentry-tracer'
import 'reflect-metadata'

import * as Sentry from '@sentry/node'
import express, { Application } from 'express'

import apiRouter from '@sb/routes/api'
import usersRouter from '@sb/routes/users'


const app: Application = express()


app.use(express.json())
// This is deprecated
app.use('/api', apiRouter)
app.use('/users', usersRouter)

Sentry.setupExpressErrorHandler(app)

export default app
