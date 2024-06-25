import '@sb/utils/sentry-tracer'
import 'reflect-metadata'

import * as Sentry from '@sentry/node'
import cors from 'cors'
import express, { Application, json } from 'express'

import apiRouter from '@sb/routes/api'
import labelsRouter from '@sb/routes/labels'
import usersRouter from '@sb/routes/users'


const app: Application = express()

app.use(cors({
  origin: 'chrome-extension://kmdlofehocppnlkpokdbiaalcelhedef',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}))
app.use(json())
// This is deprecated
app.use('/api', apiRouter)
app.use('/users', usersRouter)
app.use('/labels', labelsRouter)

Sentry.setupExpressErrorHandler(app)

export default app
