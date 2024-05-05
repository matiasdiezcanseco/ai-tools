"use server";
import "server-only";

import { revalidatePath } from "next/cache";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { addSttToDb, addSttToQueue } from "../sst";
import { uploadFile } from "../s3";

export const createSttAction = async (formData: FormData) => {
  const userId = auth().userId;
  if (!userId) throw new Error("Unauthorized");

  const user = await clerkClient.users.getUser(userId);
  if (user.privateMetadata?.role !== "admin") throw new Error("Unauthorized");

  try {
    const file = formData.get("file") as File;

    const audioUrl = await uploadFile({ file });
    const sttRequest = await addSttToDb({ audioUrl, userId });
    const sttQueueId = await addSttToQueue(sttRequest);
    return sttQueueId;
  } catch (e) {
    if (e instanceof Error) throw e;

    throw new Error("Failed to process STT request");
  } finally {
    revalidatePath("/stt");
  }
};
