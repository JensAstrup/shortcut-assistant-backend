import { DataSource } from 'typeorm'

import { User } from '@sb/entities/User'
import { Workspace } from '@sb/entities/Workspace'


const database = new DataSource({
  type: 'postgres',
  host: 'db',
  port: 5432,
  username: 'postgres',
  password: 'postgres',
  database: 'postgres',
  synchronize: true,
  entities: [
    User, Workspace
  ],
})

export default database
