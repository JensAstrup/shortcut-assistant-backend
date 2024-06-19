import '@sb/utils/sentry-tracer'
import 'reflect-metadata'

import * as Sentry from '@sentry/node'
import express, { Application } from 'express'

import apiRouter from '@sb/routes/api'


const app: Application = express()


app.use(express.json())
app.use('/api', apiRouter)
Sentry.setupExpressErrorHandler(app)

export default app
