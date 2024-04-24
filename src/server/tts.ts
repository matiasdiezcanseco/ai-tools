import "server-only";
import { db } from "./db";
import { type TtsItem, ttsTable } from "./db/schema";
import { eq } from "drizzle-orm";
import { auth } from "@clerk/nextjs/server";
import { env } from "~/env";
import axios from "axios";

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

export const addTtsToQueue = async (ttsData: TtsItem) => {
  const response = await axios.post<{ messageId: string }>(
    `${env.QSTASH_URL}${env.APP_URL}api/tts`,
    ttsData,
    {
      headers: {
        Authorization: `Bearer ${env.QSTASH_TOKEN}`,
        "Content-Type": "application/json",
      },
    },
  );
  return response.data.messageId;
};
