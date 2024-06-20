import { Response } from 'express'

import { IncomingAnalyzeRequest, PromptType, prompts } from '@sb/types/prompt-request'
import { StatusCodes } from '@sb/types/status-codes'
import { logger } from '@sb/utils/logger'


function parseIncomingRequest(req: IncomingAnalyzeRequest, res: Response): Record<string, string> | undefined {
  let { content, prompt_type }: { content?: string, prompt_type?: PromptType } = req.body
  // prompt_type and description are deprecated, pending removal
  if (!prompt_type) {
    prompt_type = req.body.promptType
  }
  if (!content) {
    content = req.body.description
  }
  if (!content || !prompt_type) {
    res.status(StatusCodes.BAD_REQUEST).json({ error: 'Both content and promptType are required fields' })
    return
  }
  logger.info(`Received request with prompt type ${prompt_type}`)
  const prompt = prompts[prompt_type]
  if (!prompt) {
    res.status(StatusCodes.BAD_REQUEST).json({ error: 'Invalid prompt type' })
    return
  }
  logger.info(`Parsed request with prompt type ${prompt_type}`)
  return { content, prompt }
}

export default parseIncomingRequest
