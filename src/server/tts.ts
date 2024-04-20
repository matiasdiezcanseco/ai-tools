import "server-only";
import { db } from "./db";
import { ttsTable } from "./db/schema";
import { eq } from "drizzle-orm";
import { auth } from "@clerk/nextjs/server";

export const getTtsRequestsByUser = async () => {
  const userId = auth().userId;

  if (!userId) {
    throw new Error("User not found");
  }

  const results = await db
    .select()
    .from(ttsTable)
    .where(eq(ttsTable.userId, userId));

  return results;
};
