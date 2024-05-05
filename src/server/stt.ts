import "server-only";
import { db } from "./db";
import { sttTable, type SelectStt } from "./db/schema";
import { env } from "~/env";
import axios from "axios";
import { auth } from "@clerk/nextjs/server";
import { and, eq } from "drizzle-orm";

export const getSttRequestByUserById = async (id: number) => {
  const userId = auth().userId;

  if (!userId) {
    throw new Error("Unauthorized");
  }

  const result = await db
    .select()
    .from(sttTable)
    .where(and(eq(sttTable.id, id), eq(sttTable.userId, userId)));

  if (!result[0]) {
    return undefined;
  }

  return result[0];
};

export const getSttRequestsByUser = async () => {
  const userId = auth().userId;

  if (!userId) {
    throw new Error("Unauthorized");
  }

  const results = await db
    .select()
    .from(sttTable)
    .where(eq(sttTable.userId, userId));

  return results;
};

export const updateSttStatusById = async ({
  id,
  status,
  text,
}: {
  id: number;
  status: string;
  text: string;
}) => {
  const result = await db
    .update(sttTable)
    .set({ status, text })
    .where(eq(sttTable.id, id))
    .returning();

  return result[0];
};

export const addSttToDb = async ({
  audioUrl,
  userId,
}: {
  audioUrl: string;
  userId: string;
}) => {
  const result = await db
    .insert(sttTable)
    .values({
      audioUrl,
      status: "pending",
      userId,
    })
    .returning();

  if (!result[0]) {
    throw new Error("Failed to create STT request");
  }

  return result[0];
};

export const addSttToQueue = async (sttData: SelectStt) => {
  try {
    const response = await axios.post<{ messageId: string }>(
      `${env.QSTASH_URL}https://${env.NEXT_PUBLIC_VERCEL_URL}/api/stt-process`,
      sttData,
      {
        headers: {
          Authorization: `Bearer ${env.QSTASH_TOKEN}`,
          "Content-Type": "application/json",
        },
      },
    );
    return response.data.messageId;
  } catch (e) {
    throw new Error("Failed to add STT request to queue");
  }
};
