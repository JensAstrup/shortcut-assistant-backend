import { Router } from 'express'

import processAnalysis from '@sb/controllers/openAi'


const router = Router()
router.post('/openai', processAnalysis)

export default router
