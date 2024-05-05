"use server";
import "server-only";

import { type ttsFormSchema } from "~/lib/schemas";
import { addTtsToDb, addTtsToQueue } from "../tts";
import { type z } from "zod";
import { revalidatePath } from "next/cache";
import { auth, clerkClient } from "@clerk/nextjs/server";

export const createTtsAction = async (
  values: z.infer<typeof ttsFormSchema>,
) => {
  const userId = auth().userId;
  if (!userId) throw new Error("Unauthorized");

  const user = await clerkClient.users.getUser(userId);
  if (user.privateMetadata?.role !== "admin") throw new Error("Unauthorized");

  try {
    const ttsRequest = await addTtsToDb({ text: values.text, userId: userId });
    const ttsQueueId = await addTtsToQueue(ttsRequest);

    return ttsQueueId;
  } catch (e) {
    if (e instanceof Error) throw e;

    throw new Error("Failed to translate TTS request");
  } finally {
    revalidatePath("/tts");
  }
};
