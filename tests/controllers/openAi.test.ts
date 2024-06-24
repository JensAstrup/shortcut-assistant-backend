import OpenAI from 'openai'
import { Chat } from 'openai/resources'
import { Stream } from 'openai/streaming'
import request from 'supertest'

import app from '@sb/app'
import { StatusCodes } from '@sb/types/status-codes'

import ChatCompletionChunk = Chat.ChatCompletionChunk


jest.mock('openai')
jest.mock('@sentry/node')



const mockedOpenAI = OpenAI as jest.Mocked<typeof OpenAI>


describe('processAnalysis', () => {
  it('should end response if content is missing', async () => {
    const mockCreate = jest.fn().mockImplementation(() => {
      const mockStream = (function* (): Generator<{ choices: [{ delta: { content: string } }] }> {
        yield { choices: [{ delta: { content: 'response from OpenAI' } }] }
      })()
      return mockStream
    })
    mockedOpenAI.prototype.chat = {
      completions: {
        create: mockCreate
      },
    } as unknown as Chat
    const { status } = await request(app).post('/api/openai').send({ promptType: 'analyze' })
    expect(status).toBe(400)
  })

  it('should end response if prompt is missing', async () => {
    const mockCreate = jest.fn().mockImplementation(() => {
      const mockStream = (function* (): Generator<{ choices: [{ delta: { content: string } }] }> {
        yield { choices: [{ delta: { content: 'response from OpenAI' } }] }
      })()
      return mockStream
    })
    mockedOpenAI.prototype.chat = {
      completions: {
        create: mockCreate
      },
    } as unknown as Chat
    const { status } = await request(app).post('/api/openai').send({ promptType: 'analyze' })
    expect(status).toBe(400)
  })

  it('should respond with a 204 if the request is valid', async () => {
    const mockCreate = jest.fn().mockImplementation(() => {
      const mockStream = (function* (): Generator<{ choices: [{ delta: { content: string } }] }> {
        yield { choices: [{ delta: { content: 'response from OpenAI' } }] }
      })()
      return mockStream
    })
    mockedOpenAI.prototype.chat = {
      completions: {
        create: mockCreate
      },
    } as unknown as Chat
    const { status } = await request(app).post('/api/openai').send({ content: 'test', promptType: 'analyze' })
    expect(status).toBe(200)
  })

  it('properly sets headers and status', async () => {
    const mockCreate = jest.fn().mockImplementation(() => {
      const mockStream = (function* (): Generator<{ choices: [{ delta: { content: string } }] }> {
        yield { choices: [{ delta: { content: 'response from OpenAI' } }] }
      })()
      return mockStream
    })
    mockedOpenAI.prototype.chat = {
      completions: {
        create: mockCreate
      },
    } as unknown as Chat
    const { headers, status } = await request(app).post('/api/openai').send({ content: 'test', promptType: 'analyze' })
    expect(headers['content-type']).toBe('text/plain')
    expect(status).toBe(200)
  })

  it('should respond with 500 if stream is undefined', async () => {
    mockedOpenAI.prototype.chat = {
      completions: {
        create: jest.fn().mockResolvedValue(undefined as unknown as Stream<ChatCompletionChunk>),
      },
    } as unknown as Chat

    const { status, body } = await request(app).post('/api/openai').send({ content: 'test', promptType: 'analyze' })

    expect(status).toBe(StatusCodes.SERVER_ERROR)
    expect(body.error).toBe('Failed to create stream')
  })
})
