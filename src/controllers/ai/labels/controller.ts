import { Request, Response } from 'express'
import { Client } from 'shortcut-api'

import getLabelsFromGPT from '@sb/controllers/ai/labels/get-labels-from-gpt'
import getUser from '@sb/controllers/users/utils/get-user'
import { StatusCodes } from '@sb/types/status-codes'
import logger from '@sb/utils/logger'


interface IncomingLabelRequest extends Request {
    body: {
        googleId: string
        storyId: string
    }
}


async function retrieveLabels(req: IncomingLabelRequest, res: Response): Promise<void> {
  const user = await getUser(req.body.googleId)
  if (!user) {
    res.status(StatusCodes.UNAUTHORIZED).json({ error: 'User not found' })
    return
  }
  logger.info(`Retrieving labels for story ${req.body.storyId}`)
  logger.info(`User: ${user.shortcutApiToken}`)
  const client = new Client(user.shortcutApiToken)
  const story = await client.stories.get(req.body.storyId)
  const workspaceLabels = await client.labels.list()
  const labelNames = workspaceLabels.map(label => label.name)
  const setLabelNames = await getLabelsFromGPT(labelNames, story.description)
  const setLabels = workspaceLabels.filter(label => setLabelNames.includes(label.name))
  story.labels = setLabels
  logger.info(`Setting labels: ${setLabels.map(label => label.id).join(', ')}`)
  await story.save()
  res.status(StatusCodes.OK).json({ setLabels })
}

export default retrieveLabels
export type { IncomingLabelRequest }
