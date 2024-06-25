import { OpenAI } from 'openai'

import getLabelsFromGPT from '@sb/controllers/ai/labels/get-labels-from-gpt'


const mockCreate = jest.fn().mockResolvedValue({
  choices: [
    {
      message: {
        content: JSON.stringify({ labels: ['feature'] })
      }
    }
  ]
})

jest.mock('openai', () => ({
  OpenAI: jest.fn().mockImplementation(() => ({
    chat: {
      completions: {
        create: mockCreate
      }
    }
  }))
}))

describe('getLabelsFromGPT', () => {
  let openAiClient: OpenAI

  beforeEach(() => {
    openAiClient = new (OpenAI as unknown as jest.Mock<OpenAI>)()
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('should return labels from GPT', async () => {
    const workspaceLabels = ['bug', 'feature', 'enhancement']
    const storyDescription = 'As a user, I want to reset my password'

    const labels = await getLabelsFromGPT(workspaceLabels, storyDescription)

    expect(openAiClient.chat.completions.create).toHaveBeenCalledWith({
      messages: [
        { role: 'system', content: expect.stringContaining(JSON.stringify(workspaceLabels)) },
        { role: 'user', content: storyDescription }
      ],
      model: 'gpt-4o',
      response_format: { type: 'json_object' }
    })
    expect(labels).toEqual(['feature'])
  })

  it('should throw an error if GPT response does not contain labels', async () => {
    const workspaceLabels = ['bug', 'feature', 'enhancement']
    const storyDescription = 'As a user, I want to reset my password'
    const mockResponse = {
      choices: [
        {
          message: {
            content: ''
          }
        }
      ]
    }
    mockCreate.mockResolvedValueOnce(mockResponse)

    await expect(getLabelsFromGPT(workspaceLabels, storyDescription)).rejects.toThrow('Failed to get labels from GPT')
  })

  it('should throw an error if GPT response is invalid JSON', async () => {
    const workspaceLabels = ['bug', 'feature', 'enhancement']
    const storyDescription = 'As a user, I want to reset my password'
    const mockResponse = {
      choices: [
        {
          message: {
            content: '{ invalid json }'
          }
        }
      ]
    }
    mockCreate.mockResolvedValueOnce(mockResponse)

    await expect(getLabelsFromGPT(workspaceLabels, storyDescription)).rejects.toThrow(SyntaxError)
  })

  it('should throw an error if GPT response is null or undefined', async () => {
    const workspaceLabels = ['bug', 'feature', 'enhancement']
    const storyDescription = 'As a user, I want to reset my password'
    const mockResponse = {
      choices: [
        {
          message: {
            content: null
          }
        }
      ]
    }
    mockCreate.mockResolvedValueOnce(mockResponse)

    await expect(getLabelsFromGPT(workspaceLabels, storyDescription)).rejects.toThrow('Failed to get labels from GPT')
  })
})
