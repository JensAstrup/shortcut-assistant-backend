import { DataSource } from 'typeorm'

import { User } from '@sb/entities/User'
import { Workspace } from '@sb/entities/Workspace'


const database = new DataSource({
  type: 'postgres',
  synchronize: true,
  url: process.env.DATABASE_URL,
  entities: [
    User, Workspace
  ],
})

export default database
