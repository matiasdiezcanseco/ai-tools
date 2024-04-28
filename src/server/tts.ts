import "server-only";
import { db } from "./db";
import { type SelectTts, ttsTable } from "./db/schema";
import { eq } from "drizzle-orm";
import { auth } from "@clerk/nextjs/server";
import { env } from "~/env";
import axios from "axios";

export const getTtsRequestById = async (id: number) => {
  const result = await db.select().from(ttsTable).where(eq(ttsTable.id, id));

  return result[0];
};

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

export const updateTtsStatusById = async ({
  id,
  status,
  url,
}: {
  id: number;
  status: string;
  url: string;
}) => {
  const result = await db
    .update(ttsTable)
    .set({ status, audioUrl: url })
    .where(eq(ttsTable.id, id))
    .returning();

  return result[0];
};

export const addTtsToDb = async (text: string) => {
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

export const addTtsToQueue = async (ttsData: SelectTts) => {
  const response = await axios.post<{ messageId: string }>(
    `${env.QSTASH_URL}https://${env.NEXT_PUBLIC_VERCEL_URL}/api/tts-process`,
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
