"use server";

import { type ttsFormSchema } from "~/lib/schemas";
import { addTtsToDb, addTtsToQueue } from "../tts";
import { type z } from "zod";
import { revalidatePath } from "next/cache";

export const createTts = async (values: z.infer<typeof ttsFormSchema>) => {
  try {
    const ttsRequest = await addTtsToDb(values.text);

    if (!ttsRequest) throw new Error("Failed to create TTS request");

    const ttsQueueId = await addTtsToQueue(ttsRequest);

    return ttsQueueId;
  } catch (e) {
    throw new Error("Failed to translate TTS request");
  } finally {
    revalidatePath("/tts");
  }
};
