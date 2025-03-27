import { config } from 'dotenv';
import { defineConfig } from "drizzle-kit";

config({ path: '../../.env' });

export default defineConfig({
  schema: "./schema.ts",
  out: "./migrations",
  dialect: "postgresql",
  dbCredentials: {
    // @ts-ignore
    // biome-ignore lint/style/noNonNullAssertion: Get database url from env
    url: process.env.DATABASE_URL!,
  },
});
