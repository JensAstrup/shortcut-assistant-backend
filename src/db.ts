import { join } from 'path'

import { DataSource } from 'typeorm'


// I really do not like this solution for handling the paths, any suggestions?
const isDevelopment = process.env.NODE_ENV === 'development'
const getPath = (folder: string): string => join(__dirname, isDevelopment ? '../src' : '../dist', folder, '**', '*.{ts,js}')

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
