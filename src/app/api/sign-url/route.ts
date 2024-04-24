import { type SignUrl, signUrlSchema } from "~/lib/schemas";
import { NextResponse } from "next/server";
import { signUrl } from "~/server/sign-url";
import { env } from "~/env";
import { db } from "~/server/db";
import { ttsTable } from "~/server/db/schema";
import { eq } from "drizzle-orm";
import { auth } from "@clerk/nextjs/server";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const body = (await request.json()) as SignUrl;

  try {
    const parsedInput = signUrlSchema.parse(body);

    const userId = auth().userId;

    const ttsRequest = await db
      .select()
      .from(ttsTable)
      .where(eq(ttsTable.id, parsedInput.id));

    const ttsData = ttsRequest[0];

    if (!ttsData) throw new Error("TTS request not found");
    if (ttsData.userId !== userId) throw new Error("Unauthorized");
    if (!ttsData.audioUrl) throw new Error("TTS not processed yet");

    const objectId = ttsData.audioUrl.split("/").pop()!;

    console.log("objectId", objectId);

    const signedUrl = await signUrl({
      bucket: env.AWS_BUCKET_NAME,
      key: objectId,
    });

    return NextResponse.json({ url: signedUrl }, { status: 200 });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: e }, { status: 500 });
  }
}
