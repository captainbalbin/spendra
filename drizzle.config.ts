import { defineConfig } from 'drizzle-kit'

export default defineConfig({
  dialect: 'postgresql', // "postgresql" | "mysql"
  schema: './server/db/schema/*',
  out: './drizzle',
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
})
