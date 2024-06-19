import { config } from 'dotenv'
import { DataSource } from 'typeorm'

import { User } from '@sb/entities/User'
import { Workspace } from '@sb/entities/Workspace'


config()


const database = new DataSource({
  type: 'postgres',
  synchronize: true,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOSTNAME,
  database: process.env.DB_NAME,
  port: parseInt(<string>process.env.DB_PORT),
  ssl: {
    rejectUnauthorized: false,
  },
  entities: [
    User, Workspace
  ],
})

export default database
