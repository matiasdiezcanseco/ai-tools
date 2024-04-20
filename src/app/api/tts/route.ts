import { ttsFormSchema } from "~/lib/schemas";
import { createTtsRequest } from "~/server/tts";

export const dynamic = "force-dynamic";

export type TtsStatus = {
  status: string;
  id: string;
  text: string;
  audio?: string;
};

export type TtsCreate = {
  text: string;
};

export async function POST(request: Request) {
  const body = (await request.json()) as TtsCreate;

  ttsFormSchema.parse(body);

  await createTtsRequest(body.text);

  return Response.json({
    status: "ok",
  } as TtsStatus);
}
