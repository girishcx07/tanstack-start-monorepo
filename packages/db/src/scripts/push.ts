import type { PgDatabase, PgQueryResultHKT } from "drizzle-orm/pg-core";
import { pushSchema } from "drizzle-kit/api";

import { db } from "../client";
import * as schema from "../schema";

const dbPush = async () => {
  const res = await pushSchema(
    schema,
    db as unknown as PgDatabase<PgQueryResultHKT>,
  );
  console.log("Has data loss:", res.hasDataLoss);
  console.log("Warnings:", res.warnings);
  return res.apply();
};

if (import.meta.url === `file://${process.argv[1]}`) {
  void dbPush()
    .then(() => {
      console.log("Database pushed successfully.");
      process.exit(0);
    })
    .catch((e) => {
      console.error(e);
      process.exit(1);
    });
}
