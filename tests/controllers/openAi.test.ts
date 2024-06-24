import request from 'supertest'

import app from '@sb/app'


jest.mock('openai')
jest.mock('@sentry/node')




jest.mock('openai', () => {
  const mockCreate = jest.fn().mockImplementation(() => {
    const mockStream = (function* (): Generator<{ choices: [{ delta: { content: string } }] }> {
      yield { choices: [{ delta: { content: 'response from OpenAI' } }] }
    })()
    return mockStream
  })

  return jest.fn().mockImplementation(() => {
    return {
      chat: {
        completions: {
          create: mockCreate
        }
      }
    }
  })
})


describe('processAnalysis', () => {
  it('should respond with a 400 if content is missing', async () => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const { status, body } = await request(app).post('/api/openai').send({ promptType: 'analyze' })
    expect(status).toBe(400)
    expect(body).toHaveProperty('error')
    expect(body.error).toBe('Both content and promptType are required fields')
  })

  it('should respond with a 400 if promptType is missing', async () => {
    const { status, body } = await request(app).post('/api/openai').send({ content: 'test' })
    expect(status).toBe(400)
    expect(body).toHaveProperty('error')
    expect(body.error).toBe('Both content and promptType are required fields')
  })

  it('should respond with a 400 if promptType is invalid', async () => {
    const { status, body } = await request(app).post('/api/openai').send({ content: 'test', promptType: 'invalid' })
    expect(status).toBe(400)
    expect(body).toHaveProperty('error')
    expect(body.error).toBe('Invalid prompt type')
  })

  it('should respond with a 204 if the request is valid', async () => {
    const { status } = await request(app).post('/api/openai').send({ content: 'test', promptType: 'analyze' })
    expect(status).toBe(200)
  })

  it('properly sets headers and status', async () => {
    const { headers, status } = await request(app).post('/api/openai').send({ content: 'test', promptType: 'analyze' })
    expect(headers['content-type']).toBe('text/plain')
    expect(status).toBe(200)
  })
})
