import { DataSource } from 'typeorm'

import { User } from '@sb/entities/User'
import { Workspace } from '@sb/entities/Workspace'


// Define base paths for different environments
const basePath = process.env.BASE_PATH || (__dirname.includes('dist') ? 'dist/src' : 'src')


const database = new DataSource({
  type: 'postgres',
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOSTNAME,
  database: process.env.DB_NAME,
  port: parseInt(<string>process.env.DB_PORT),
  ssl: process.env.NODE_ENV === 'development' ? false : { rejectUnauthorized: false },
  migrations: [`${basePath}/migrations/**/*`],
  entities: [User, Workspace],
})

export default database
