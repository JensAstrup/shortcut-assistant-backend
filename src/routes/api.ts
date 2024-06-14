import {Router} from 'express'

import processAnalysis from '../controllers/openAi'


const router = Router()
router.post('/openai', processAnalysis)

export default router
