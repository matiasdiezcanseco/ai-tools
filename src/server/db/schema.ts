// Example model schema from the Drizzle docs
// https://orm.drizzle.team/docs/sql-schema-declaration

import { type InferSelectModel, sql } from "drizzle-orm";
import {
  index,
  pgTableCreator,
  serial,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";

/**
 * This is an example of how to use the multi-project schema feature of Drizzle ORM. Use the same
 * database instance for multiple projects.
 *
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */
export const createTable = pgTableCreator((name) => `ai-tools_${name}`);

export const ttsTable = createTable(
  "tts",
  {
    id: serial("id").primaryKey(),
    text: varchar("text", { length: 500 }).notNull(),
    status: varchar("status", { length: 50 }).notNull(),
    audioUrl: varchar("audio_url", { length: 500 }),
    createdAt: timestamp("created_at")
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp("updatedAt"),
    userId: varchar("user_id", { length: 128 }).notNull(),
  },
  (example) => ({
    userIdIndex: index("user_id").on(example.userId),
  }),
);

export type TtsItem = InferSelectModel<typeof ttsTable>;
