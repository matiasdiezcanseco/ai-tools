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

export const createTtsRequest = async (text: string) => {
  const userId = auth().userId;

  if (!userId) {
    throw new Error("User not found");
  }

  const result = await db
    .insert(ttsTable)
    .values({
      text,
      status: "pending",
      userId,
    })
    .returning();

  return result[0];
};
