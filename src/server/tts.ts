import "server-only";
import { db } from "./db";
import { type SelectTts, ttsTable } from "./db/schema";
import { and, eq } from "drizzle-orm";
import { auth } from "@clerk/nextjs/server";
import { env } from "~/env";
import axios from "axios";

export const getTtsRequestById = async (id: number) => {
  const result = await db.select().from(ttsTable).where(eq(ttsTable.id, id));

  return result[0];
};

export const getTtsRequestByUserById = async (id: number) => {
  const userId = auth().userId;

  if (!userId) {
    throw new Error("Unauthorized");
  }

  const result = await db
    .select()
    .from(ttsTable)
    .where(and(eq(ttsTable.id, id), eq(ttsTable.userId, userId)));

  if (!result[0]) {
    return undefined;
  }

  return result[0];
};

export const getTtsRequestsByUser = async () => {
  const userId = auth().userId;

  if (!userId) {
    throw new Error("Unauthorized");
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
  url?: string;
}) => {
  const result = await db
    .update(ttsTable)
    .set({ status, audioUrl: url })
    .where(eq(ttsTable.id, id))
    .returning();

  return result[0];
};

export const addTtsToDb = async ({
  text,
  userId,
}: {
  text: string;
  userId: string;
}) => {
  const result = await db
    .insert(ttsTable)
    .values({
      text,
      status: "pending",
      userId,
    })
    .returning();

  if (!result[0]) {
    throw new Error("Failed to create TTS request");
  }

  return result[0];
};

export const addTtsToQueue = async (ttsData: SelectTts) => {
  try {
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
  } catch (e) {
    throw new Error("Failed to add TTS request to queue");
  }
};
