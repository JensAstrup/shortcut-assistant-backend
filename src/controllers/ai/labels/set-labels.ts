import { Client, Label } from 'shortcut-api'


async function setLabels(storyId: string, setLabels: Label[]): Promise<void> {
  const client = new Client()
  const story = await client.stories.get(storyId)
  story.labels = story.labels.concat(setLabels)
  await story.save()
}

export default setLabels
