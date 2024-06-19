import { config } from 'dotenv'


config()

import { logger } from '@sb/utils/logger'

import app from './app'


// eslint-disable-next-line no-magic-numbers
const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`)
})
