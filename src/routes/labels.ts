import { Router } from 'express'

import retrieveLabels from '@sb/controllers/ai/labels/controller'



const labelsRouter = Router()
labelsRouter.get('/', retrieveLabels)

export default labelsRouter
