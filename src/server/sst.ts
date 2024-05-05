import "server-only";
import { db } from "./db";
import { sttTable, type SelectStt } from "./db/schema";
import { env } from "~/env";
import axios from "axios";

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
