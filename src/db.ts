import { join } from 'path'

import { config } from 'dotenv'
import { DataSource } from 'typeorm'


config()

const isDevelopment = process.env.NODE_ENV === 'development'
const entitiesPath = isDevelopment ? 'src/entities/**/*.ts' : 'dist/entities/**/*.js'
const migrationsPath = isDevelopment ? 'src/migrations/**/*.ts' : 'dist/migrations/**/*.js'

const dataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || '5432', 10),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  ssl: isDevelopment ? false : { rejectUnauthorized: false },
  entities: [entitiesPath],
  migrations: [migrationsPath],
  logging: true,
})

export default dataSource
