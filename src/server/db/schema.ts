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
import { createSelectSchema } from "drizzle-zod";
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

export const sttTable = createTable("stt", {
  id: serial("id").primaryKey(),
  text: varchar("text", { length: 1000 }),
  status: varchar("status", { length: 50 }).notNull(),
  audioUrl: varchar("audio_url", { length: 500 }).notNull(),
  createdAt: timestamp("created_at")
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: timestamp("updatedAt"),
  userId: varchar("user_id", { length: 128 }).notNull(),
});

export const selectTtsSchema = createSelectSchema(ttsTable);
export type SelectTts = InferSelectModel<typeof ttsTable>;
// SelectTts.status only has 3 possible values: "pending", "failed", "completed"
// https://orm.drizzle.team/docs/indexes-constraints
// Not implemented yet

export const selectSttSchema = createSelectSchema(sttTable);
export type SelectStt = InferSelectModel<typeof sttTable>;
