import { NextResponse } from "next/server";
import { type SelectTti, selectTtiSchema } from "~/server/db/schema";

import { env } from "~/env";
import { updateTtiStatusById } from "~/server/tti";
import OpenAI from "openai";

export const dynamic = "force-dynamic";

// Hobby plan only allows max 10s duration
//The function needs 30s duration
export const maxDuration = 10;

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as SelectTti;

    const parsedBody = selectTtiSchema
      .pick({ text: true, id: true })
      .parse(body);

    const openai = new OpenAI({ apiKey: env.OPEN_AI_API_KEY });

    const response = await openai.images.generate({
      model: "dall-e-3",
      prompt: parsedBody.text,
      n: 1,
      size: "1024x1024",
    });

    if (!response.data[0]) {
      throw new Error("Failed to generate image");
    }

    const imageUrl = response.data[0].url;

    const updatedTti = await updateTtiStatusById({
      id: parsedBody.id,
      status: "finished",
      url: imageUrl,
    });

    if (!updatedTti) {
      throw new Error("Failed to update TTI status");
    }

    return NextResponse.json(
      { id: updatedTti.id, imageUrl: updatedTti.imageUrl },
      { status: 200 },
    );
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: e }, { status: 500 });
  }
}
