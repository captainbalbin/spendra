import { drizzle } from 'drizzle-orm/postgres-js'
import { migrate } from 'drizzle-orm/postgres-js/migrator'
import postgres from 'postgres'

console.log('Starting migration...')

const isProduction = process.env.NODE_ENV === 'production'
const databaseUrl = isProduction ? process.env.PROD_DATABASE_URL! : process.env.DEV_DATABASE_URL!

const migrationClient = postgres(databaseUrl, { max: 1 })
await migrate(drizzle(migrationClient), { migrationsFolder: './drizzle' })

console.log('Migration complete!')

process.exit()
