import { Response } from 'express'
// eslint-disable-next-line import/no-named-as-default
import OpenAI from 'openai'
import { Chat } from 'openai/resources'
import { Stream } from 'openai/streaming'

import parseIncomingRequest from '@sb/controllers/ai/analyze/parse-incoming-request'
import { IncomingAnalyzeRequest } from '@sb/types/prompt-request'

import { StatusCodes } from '../types/status-codes'

import ChatCompletionChunk = Chat.ChatCompletionChunk


const openai = new OpenAI()


export default async function processAnalysis(req: IncomingAnalyzeRequest, res: Response): Promise<void> {
  const { content, prompt } = parseIncomingRequest(req, res) || {}
  if (!content || !prompt) {
    res.end()
    return
  }
  let stream: Stream<ChatCompletionChunk> | undefined
  try {
    stream = await openai.chat.completions.create({
      messages: [{ role: 'system', content: prompt }, { role: 'user', content: content }],
      model: 'gpt-4o',
      stream: true
    })
  }
  catch (error: unknown) {
    if (error instanceof Error) {
      res.status(StatusCodes.SERVER_ERROR).json({ error: error.message })
      res.end()
      return
    }
  }
  if (!stream) {
    res.status(StatusCodes.SERVER_ERROR).json({ error: 'Failed to create stream' })
    res.end()
    return
  }

  res.setHeader('Content-Type', 'text/plain')
  res.status(StatusCodes.OK)

  for await (const chunk of stream) {
    res.write(chunk.choices[0]?.delta?.content || '')
  }
  res.end()
}
