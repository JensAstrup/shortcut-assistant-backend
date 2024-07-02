import { Router } from 'express'

import processAnalysis from '@sb/controllers/ai/analyze/analysis'


// The API route is deprecated
const router = Router()
router.post('/openai', processAnalysis)

export default router
