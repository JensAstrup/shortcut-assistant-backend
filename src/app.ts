import '@sb/utils/sentry-tracer'
import 'reflect-metadata'

import * as Sentry from '@sentry/node'
import cors from 'cors'
import express, { Application, json } from 'express'

import authMiddleware from '@sb/middleware/auth-headers'
import apiRouter from '@sb/routes/api'
import labelsRouter from '@sb/routes/labels'
import noAuthUsersRouter from '@sb/routes/users'


const app: Application = express()

app.use(cors({
  origin: 'chrome-extension://kmdlofehocppnlkpokdbiaalcelhedef',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}))
app.use(json())

app.use('/api', apiRouter) // This route is deprecated
app.use('/users', noAuthUsersRouter)
app.use(authMiddleware)
app.use('/labels', labelsRouter)

if (process.env.NODE_ENV !== 'development') {
  Sentry.setupExpressErrorHandler(app)
}

export default app
