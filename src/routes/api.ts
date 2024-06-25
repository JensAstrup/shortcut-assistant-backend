import { Router } from 'express'

import processAnalysis from '@sb/controllers/ai/analyze/analysis'


const router = Router()
router.post('/openai', processAnalysis)

export default router
