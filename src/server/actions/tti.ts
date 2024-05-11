"use server";
import "server-only";

import { addTtiToDb, addTtiToQueue } from "../tti";
import { type z } from "zod";
import { revalidatePath } from "next/cache";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { type ttiFormSchema } from "~/lib/schemas";

export const createTtiAction = async (
  values: z.infer<typeof ttiFormSchema>,
) => {
  const userId = auth().userId;
  if (!userId) throw new Error("Unauthorized");

  const user = await clerkClient.users.getUser(userId);
  if (user.privateMetadata?.role !== "admin") throw new Error("Unauthorized");

  try {
    const ttiRequest = await addTtiToDb({ text: values.text, userId: userId });
    const ttiQueueId = await addTtiToQueue(ttiRequest);

    return ttiQueueId;
  } catch (e) {
    if (e instanceof Error) throw e;

    throw new Error("Failed to translate TTI request");
  } finally {
    revalidatePath("/tti");
  }
};
