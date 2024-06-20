import { config } from 'dotenv'


config()

import database from '@sb/db'
import { logger } from '@sb/utils/logger'

import app from './app'

// eslint-disable-next-line no-magic-numbers
const PORT = process.env.PORT || 3000

async function startServer(): Promise<void> {
  try {
    await database.initialize()
    logger.info('Database connected')

    app.listen(PORT, () => {
      logger.info(`Server running on port ${PORT}`)
    })
  }
  catch (error) {
    logger.error('Database connection error', error)
    process.exit(1) // Exit the process if the database connection fails
  }
}

startServer()

export default startServer
