// prisma.config.ts
import "dotenv/config"
import { defineConfig, env } from "prisma/config"

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: { 
    path: "prisma/migrations",
    seed: "tsx prisma/seed.ts",
  },
  datasource: {
    // migrate は Neon の Direct を推奨（Pooler だと不安定なことがある）
    url: env("DIRECT_URL"),
  },
})
