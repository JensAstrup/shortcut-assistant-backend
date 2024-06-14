import request from 'supertest'

import app from '../../src/app'


jest.mock('openai')




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
    await request(app).post('/api/openai')
      .send({ promptType: 'analyze'})
      .expect(400)
      .expect({ error: 'Both content and promptType are required fields' })
  })
 
  it('should respond with a 400 if promptType is missing', async () => {
    await request(app).post('/api/openai')
      .send({ content: 'test'})
      .expect(400)
      .expect({ error: 'Both content and promptType are required fields' })
  })

  it('should respond with a 400 if promptType is invalid', async () => {
    await request(app).post('/api/openai')
      .send({ content: 'test', promptType: 'invalid'})
      .expect(400)
      .expect({ error: 'Invalid prompt type' })
  })

  it('should respond with a 204 if the request is valid', async () => {
    await request(app).post('/api/openai')
      .send({ content: 'test', promptType: 'analyze'})
      .expect(200)
  })

})
