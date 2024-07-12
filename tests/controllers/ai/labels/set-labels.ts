import { Label, Story } from 'shortcut-api'

import setLabels from '@sb/controllers/ai/labels/set-labels'


const mockStory = {
  labels: [],
  save: jest.fn()
} as unknown as jest.Mocked<Story>

const mockClientInstance = {
  stories: {
    get: jest.fn().mockResolvedValue(mockStory)
  }
}
const mockClient = jest.fn(() => mockClientInstance)
jest.mock('shortcut-api', () => {
  return {
    Client: mockClient
  }
})

describe('setLabels', () => {
  it('should set labels', async () => {
    const storyId = 'story-id'
    const setLabelsArray = [{ id: 1, name: 'label1' }, { id: 2, name: 'label2' }] as unknown as Label[]
    await setLabels(storyId, setLabelsArray)
    expect(mockClientInstance.stories.get).toHaveBeenCalledWith(storyId)
    expect(mockStory.labels).toEqual(setLabelsArray)
    expect(mockStory.save).toHaveBeenCalled()
  })

  it('should set labels with existing labels', async () => {
    const storyId = 'story-id'
    const setLabelsArray = [{ id: 1, name: 'label1' }, { id: 2, name: 'label2' }] as unknown as Label[]
    mockStory.labels = [{ id: 3, name: 'label3' } as Label]
    await setLabels(storyId, setLabelsArray)
    expect(mockClientInstance.stories.get).toHaveBeenCalledWith(storyId)
    expect(mockStory.labels).toEqual([{ id: 3, name: 'label3' }, { id: 1, name: 'label1' }, { id: 2, name: 'label2' }])
    expect(mockStory.save).toHaveBeenCalled()
  })
})
