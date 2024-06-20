import { config } from 'dotenv'
import { DataSource } from 'typeorm'


config()


const database = new DataSource({
  type: 'postgres',
  synchronize: true,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOSTNAME,
  database: process.env.DB_NAME,
  port: parseInt(<string>process.env.DB_PORT),
  ssl: process.env.NODE_ENV === 'development' ? false : { rejectUnauthorized: false },
  migrations: ['src/migrations/**/*.ts'],
  entities: ['src/entities/**/*.ts'],
})

export default database
