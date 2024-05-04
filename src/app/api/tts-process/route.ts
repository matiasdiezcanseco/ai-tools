import { NextResponse } from "next/server";
import { type SelectTts, selectTtsSchema } from "~/server/db/schema";
import {
  StartSpeechSynthesisTaskCommand,
  PollyClient,
  OutputFormat,
  TextType,
  VoiceId,
} from "@aws-sdk/client-polly";
import { env } from "~/env";
import { updateTtsStatusById } from "~/server/tts";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const body = (await request.json()) as SelectTts;

  const parsedBody = selectTtsSchema.pick({ text: true, id: true }).parse(body);

  const pollyClient = new PollyClient({
    region: "us-east-1",
    credentials: {
      accessKeyId: env.AWS_ACCESS_KEY_ID,
      secretAccessKey: env.AWS_SECRET_ACCESS_KEY,
    },
  });

  const params = {
    OutputFormat: OutputFormat.MP3,
    Text: parsedBody.text,
    TextType: TextType.TEXT,
    VoiceId: VoiceId.Joanna,
    OutputS3BucketName: env.AWS_BUCKET_NAME,
    SampleRate: "22050",
  };

  try {
    const response = await pollyClient.send(
      new StartSpeechSynthesisTaskCommand(params),
    );

    if (!response?.SynthesisTask?.OutputUri)
      throw new Error("No url returned from Polly");

    const updatedTts = await updateTtsStatusById({
      id: parsedBody.id,
      status: "finished",
      url: response.SynthesisTask.OutputUri,
    });

    if (!updatedTts) throw new Error("Failed to update TTS status");

    return NextResponse.json(
      { id: updatedTts.id, audioUrl: updatedTts.audioUrl },
      { status: 200 },
    );
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: e }, { status: 500 });
  }
}
