import { defineConfig } from 'drizzle-kit'

const isProduction = process.env.NODE_ENV === 'production'

export default defineConfig({
  dialect: 'postgresql',
  schema: './server/db/schema/*',
  driver: 'aws-data-api',
  out: './drizzle',
  dbCredentials: {
    url: isProduction ? process.env.PROD_DATABASE_URL! : process.env.DEV_DATABASE_URL!,
  },
})
