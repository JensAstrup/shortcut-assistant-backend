import OpenAI from 'openai'


const BASE_SYSTEM_MESSAGE: string = 'You are an expert Product Manager tasked with labelling engineering issues. Given user stories or issues, '
  + 'you return a JSON array (key: labels) of labels that are applicable from the following:'

interface OpenAIResponse {
  labels: string[]
}

async function getLabelsFromGPT(workspaceLabels: string[], storyDescription: string): Promise<string[]> {
  const openAiClient = new OpenAI()
  const systemMessage = BASE_SYSTEM_MESSAGE + JSON.stringify(workspaceLabels)
  const response = await openAiClient.chat.completions.create({
    messages: [{ role: 'system', content: systemMessage }, { role: 'user', content: storyDescription }],
    model: 'gpt-4o',
    response_format: { type: 'json_object' }
  })
  const labels = response.choices[0]?.message.content
  if (!labels) {
    throw new Error('Failed to get labels from GPT')
  }
  const labelsArray: OpenAIResponse = JSON.parse(labels)
  return labelsArray.labels
}

export default getLabelsFromGPT
