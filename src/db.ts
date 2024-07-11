import { join } from 'path'

import { DataSource } from 'typeorm'

// Define base paths for different environments
const basePath = process.env.BASE_PATH || (__dirname.includes('dist') ? join(__dirname, '../dist') : join(__dirname, '../src'))

const getPath = (folder: string): string => join(basePath, folder, '**', '*.{ts,js}')

const database = new DataSource({
  type: 'postgres',
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOSTNAME,
  database: process.env.DB_NAME,
  port: parseInt(<string>process.env.DB_PORT),
  ssl: process.env.NODE_ENV === 'development' ? false : { rejectUnauthorized: false },
  migrations: [getPath('migrations')],
  entities: [getPath('entities')],
})

export default database
