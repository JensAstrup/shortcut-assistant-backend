import { Router } from 'express'

import retrieveLabels from '@sb/controllers/ai/labels/controller'



const labelsRouter = Router()
labelsRouter.post('/', retrieveLabels)

export default labelsRouter
