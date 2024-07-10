import { join } from 'path'

import { config } from 'dotenv'
import { DataSource } from 'typeorm'


config()

const isDevelopment = process.env.NODE_ENV === 'development'
const basePath = isDevelopment ? 'src' : 'dist'

const dataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || '5432', 10),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  ssl: isDevelopment ? false : { rejectUnauthorized: false },
  entities: [join(__dirname, `../${basePath}/entities/**/*.{ts,js}`)],
  migrations: [join(__dirname, `../${basePath}/migrations/**/*.{ts,js}`)],
  logging: true,
})

export default dataSource
