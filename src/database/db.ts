import { DataSource } from 'typeorm'

import { User } from '../entities/User' // Import your entities directly
import { AddGoogleId1718845343596 } from '../migrations/1718845343596-createUserWorkspace'
// Import your migrations directly

const isDevelopment = process.env.NODE_ENV === 'development'

const database = new DataSource({
  type: 'postgres',
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOSTNAME,
  database: process.env.DB_NAME,
  port: parseInt(<string>process.env.DB_PORT, 10),
  ssl: isDevelopment ? false : { rejectUnauthorized: false },
  entities: [User], // List all your entity classes here
  migrations: [AddGoogleId1718845343596], // List all your migration classes here
  synchronize: isDevelopment, // Optionally auto-sync schema in development
  logging: isDevelopment, // Enable logging in development
})

export default database
