import apiRouter from '@sb/routes/api'
import express, { Application } from 'express'


const app: Application = express()

app.use(express.json())
app.use('/api', apiRouter)


export default app
