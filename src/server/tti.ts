import "server-only";
import { db } from "./db";
import { type SelectTti, ttiTable } from "./db/schema";
import { and, eq } from "drizzle-orm";
import { auth } from "@clerk/nextjs/server";
import { env } from "~/env";
import axios from "axios";

export const getTtiRequestById = async (id: number) => {
  const result = await db.select().from(ttiTable).where(eq(ttiTable.id, id));

  return result[0];
};

export const getTtiRequestByUserById = async (id: number) => {
  const userId = auth().userId;

  if (!userId) {
    throw new Error("Unauthorized");
  }

  const result = await db
    .select()
    .from(ttiTable)
    .where(and(eq(ttiTable.id, id), eq(ttiTable.userId, userId)));

  if (!result[0]) {
    return undefined;
  }

  return result[0];
};

export const getTtiRequestsByUser = async () => {
  const userId = auth().userId;

  if (!userId) {
    throw new Error("Unauthorized");
  }

  const results = await db
    .select()
    .from(ttiTable)
    .where(eq(ttiTable.userId, userId));

  return results;
};

export const updateTtiStatusById = async ({
  id,
  status,
  url,
}: {
  id: number;
  status: "finished" | "failed" | "pending";
  url?: string;
}) => {
  const result = await db
    .update(ttiTable)
    .set({ status, imageUrl: url })
    .where(eq(ttiTable.id, id))
    .returning();

  return result[0];
};

export const addTtiToDb = async ({
  text,
  userId,
}: {
  text: string;
  userId: string;
}) => {
  const result = await db
    .insert(ttiTable)
    .values({
      text,
      status: "pending",
      userId,
    })
    .returning();

  if (!result[0]) {
    throw new Error("Failed to create TTI request");
  }

  return result[0];
};

export const addTtiToQueue = async (ttiData: SelectTti) => {
  try {
    const response = await axios.post<{ messageId: string }>(
      `${env.QSTASH_URL}https://${env.NEXT_PUBLIC_VERCEL_URL}/api/tti-process`,
      ttiData,
      {
        headers: {
          Authorization: `Bearer ${env.QSTASH_TOKEN}`,
          "Content-Type": "application/json",
        },
      },
    );
    return response.data.messageId;
  } catch (e) {
    throw new Error("Failed to add TTI request to queue");
  }
};
