import "dotenv/config";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import { db } from "./index";

async function main() {
  await migrate(db, { migrationsFolder: "drizzle/migrations" });
  process.exit(0);
}

main();
