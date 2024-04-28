import { getTtsRequestById } from "~/server/tts";
import { NextResponse } from "next/server";
import { z } from "zod";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  try {
    const parsedId = z.string().parse(id);
    if (!parsedId) throw new Error("Invalid ID");

    const ttsRequest = await getTtsRequestById(parseInt(parsedId));
    if (!ttsRequest) throw new Error("Failed to get TTS request");

    return NextResponse.json({ ttsRequest }, { status: 200 });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: e }, { status: 500 });
  }
}
