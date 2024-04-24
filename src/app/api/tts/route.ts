import { ttsFormSchema } from "~/lib/schemas";
import { addTtsToQueue, addTtsToDb } from "~/server/tts";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export type TtsCreate = {
  text: string;
};

export async function POST(request: Request) {
  const body = (await request.json()) as TtsCreate;

  try {
    const parsedInput = ttsFormSchema.parse(body);
    const ttsRequest = await addTtsToDb(parsedInput.text);

    if (!ttsRequest) throw new Error("Failed to create TTS request");

    const ttsQueue = await addTtsToQueue(ttsRequest);

    return NextResponse.json({ id: ttsQueue }, { status: 201 });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: e }, { status: 500 });
  }
}
