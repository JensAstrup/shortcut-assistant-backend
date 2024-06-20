import { Response } from 'express'
import OpenAI from 'openai'

import parseIncomingRequest from '@sb/controllers/ai/analyze/parse-incoming-request'
import { IncomingAnalyzeRequest } from '@sb/types/prompt-request'

import { StatusCodes } from '../types/status-codes'


const openai = new OpenAI()


export default async function processAnalysis(req: IncomingAnalyzeRequest, res: Response): Promise<void> {
  const { content, prompt } = parseIncomingRequest(req, res) || {}

  try {
    const stream = await openai.chat.completions.create({
      messages: [{ role: 'system', content: prompt }, { role: 'user', content: content }],
      model: 'gpt-4o',
      stream: true
    })
    for await (const chunk of stream) {
      res.write(chunk.choices[0]?.delta?.content || '')
    }
    res.status(StatusCodes.NO_CONTENT).end()
  }
  catch (error: unknown) {
    if (error instanceof Error) {
      res.status(StatusCodes.SERVER_ERROR).json({ error: error.message })
    }
  }
}
