import { Response } from 'express'
import { Client, LabelInterface, Story } from 'shortcut-api'

import retrieveLabels, { IncomingLabelRequest } from '@sb/controllers/ai/labels/controller'
import getLabelsFromGPT from '@sb/controllers/ai/labels/get-labels-from-gpt'
import getUser from '@sb/controllers/users/utils/get-user'
import { User } from '@sb/entities/User'
import { StatusCodes } from '@sb/types/status-codes'
import logger from '@sb/utils/logger'


jest.mock('@sb/controllers/users/utils/get-user')
jest.mock('shortcut-api')
jest.mock('@sb/controllers/ai/labels/get-labels-from-gpt')
jest.mock('@sb/utils/logger')

const mockGetUser = getUser as jest.MockedFunction<typeof getUser>
const mockClient = Client as jest.MockedClass<typeof Client>
const mockGetLabelsFromGPT = getLabelsFromGPT as jest.MockedFunction<typeof getLabelsFromGPT>


describe('retrieveLabels', () => {
  let req: IncomingLabelRequest
  let res: Partial<Response>
  let mockUser: User
  let mockStory: Partial<Story>
  let mockLabels: Partial<LabelInterface>[]
  let mockClientInstance: jest.Mocked<Client>

  beforeEach(() => {
    req = {
      query: {
        googleId: 'test-google-id',
        storyId: 'test-story-id'
      }
    } as IncomingLabelRequest
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    }
    mockUser = {
      email: '',
      name: '',
      shortcutApiToken: 'test-token',
      googleId: 'test-google-id'
    } as User
    mockStory = {
      description: 'test description',
      labels: [],
      save: jest.fn(),
      id: 123
    }
    mockLabels = [
      { id: 1, name: 'label1' },
      { id: 2, name: 'label2' },
      { id: 3, name: 'label3' }
    ]

    mockGetUser.mockResolvedValue(mockUser)
    // @ts-ignore
    const MockClient = mockClient.mockImplementation(() => ({
      headers: {},
      shortcutApiKey: '',
      stories: {
        get: jest.fn().mockResolvedValue(mockStory)
      },
      labels: {
        list: jest.fn().mockResolvedValue(mockLabels)
      },
      workflows: {},
      iterations: {}
    }))
    mockGetLabelsFromGPT.mockResolvedValue(['label1', 'label3'])
    mockClientInstance = new MockClient() as jest.Mocked<Client>
  })

  it('should respond with UNAUTHORIZED if user is not found', async () => {
    (getUser as jest.Mock).mockResolvedValue(null)

    await retrieveLabels(req, res as Response)

    expect(res.status).toHaveBeenCalledWith(StatusCodes.UNAUTHORIZED)
    expect(res.json).toHaveBeenCalledWith({ error: 'User not found' })
  })

  it('should retrieve and set labels on the story', async () => {
    await retrieveLabels(req, res as Response)


    expect(logger.info).toHaveBeenCalledWith(`Retrieving labels for story ${req.query.storyId}`)
    expect(logger.info).toHaveBeenCalledWith(`User: ${mockUser.shortcutApiToken}`)
    expect(mockClient).toHaveBeenCalledWith(mockUser.shortcutApiToken)

    expect(getLabelsFromGPT).toHaveBeenCalledWith(['label1', 'label2', 'label3'], 'test description')
    expect(mockStory.labels).toEqual([mockLabels[0], mockLabels[2]])
    expect(mockStory.save).toHaveBeenCalled()

    expect(logger.info).toHaveBeenCalledWith('Setting labels: 1, 3')
    expect(res.status).toHaveBeenCalledWith(StatusCodes.OK)
    expect(res.json).toHaveBeenCalledWith({ setLabels: [mockLabels[0], mockLabels[2]] })
  })
})
