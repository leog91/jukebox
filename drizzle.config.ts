import type { Config } from "drizzle-kit";
import * as dotenv from "dotenv";
dotenv.config();



import { defineConfig } from "drizzle-kit";
export default defineConfig({
    dialect: "turso",
    schema: "./src/db/schema.ts",
    out: "./src/db/migrations",
    dbCredentials: {
        url: process.env.TURSO_DATABASE_URL as string,
        authToken: process.env.TURSO_AUTH_TOKEN,
    },

});

