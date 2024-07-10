import { join } from 'path'

import { DataSource } from 'typeorm'


// I really do not like this solution for handling the paths, any suggestions?
const isDevelopment = process.env.NODE_ENV === 'development'
const rootPath = isDevelopment ? 'src' : ''
const migrationsPath = join(__dirname, '..', rootPath, 'migrations', '**', '*.{ts,js}')
console.log('migrationsPath', migrationsPath)
const entitiesPath = join(__dirname, '..', rootPath, 'entities', '**', '*.{ts,js}')
console.log('entitiesPath', entitiesPath)

const database = new DataSource({
  type: 'postgres',
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOSTNAME,
  database: process.env.DB_NAME,
  port: parseInt(<string>process.env.DB_PORT),
  ssl: process.env.NODE_ENV === 'development' ? false : { rejectUnauthorized: false },
  migrations: [migrationsPath],
  entities: [entitiesPath],
})

export default database
