import { defineConfig } from "drizzle-kit";
import * as dotenv from "dotenv";
import { config } from "dotenv";

// Load .env file
config();

// Load environment variables from .env
dotenv.config({ path: ".env" }); // Replace with your .env path if needed

export default defineConfig({
  out: "./migrations",
  schema: "./shared/schema.ts",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL!, // Use "!" to assert non-null (if you're sure it exists)
  },
});
