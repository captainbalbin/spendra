import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'

const isProduction = process.env.NODE_ENV === 'production'
const databaseUrl = isProduction ? process.env.PROD_DATABASE_URL! : process.env.DEV_DATABASE_URL!

const queryClient = postgres(databaseUrl)
export const db = drizzle(queryClient)
