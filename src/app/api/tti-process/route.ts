import { NextResponse } from "next/server";
import { type SelectTti, selectTtiSchema } from "~/server/db/schema";

import { env } from "~/env";
import { updateTtiStatusById } from "~/server/tti";
import OpenAI from "openai";

export const dynamic = "force-dynamic";

export const maxDuration = 40;

export async function POST(request: Request) {
  const body = (await request.json()) as SelectTti;

  const parsedBody = selectTtiSchema.pick({ text: true, id: true }).parse(body);

  const updateRequestAsFailed = async () => {
    await updateTtiStatusById({
      id: parsedBody.id,
      status: "failed",
    });
  };

  try {
    const openai = new OpenAI({ apiKey: env.OPEN_AI_API_KEY });

    const response = await openai.images.generate({
      model: "dall-e-3",
      prompt: parsedBody.text,
      n: 1,
      size: "1024x1024",
    });

    if (!response.data[0]) {
      await updateRequestAsFailed();
      throw new Error("Failed to generate image");
    }

    const imageUrl = response.data[0].url;

    const updatedTti = await updateTtiStatusById({
      id: parsedBody.id,
      status: "finished",
      url: imageUrl,
    });

    if (!updatedTti) {
      await updateRequestAsFailed();
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
