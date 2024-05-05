import { NextResponse } from "next/server";
import { type SelectStt, selectSttSchema } from "~/server/db/schema";
import {
  TranscribeClient,
  StartTranscriptionJobCommand,
  LanguageCode,
  ListTranscriptionJobsCommand,
} from "@aws-sdk/client-transcribe";
import { signUrl } from "~/server/s3";
import { env } from "~/env";
import { updateSttStatusById } from "~/server/stt";

export const dynamic = "force-dynamic";

type TranscriptionJob = {
  jobName: string;
  accountId: string;
  status: "COMPLETED";
  results: {
    transcripts: { transcript: string }[];
    items: TranscriptionItem[];
  };
};

type TranscriptionItem = {
  type: "pronunciation" | "punctuation";
  alternatives: { confidence: string; content: string }[];
  start_time: string;
  end_time: string;
};

export async function POST(request: Request) {
  const body = (await request.json()) as SelectStt;

  const parsedBody = selectSttSchema
    .pick({ audioUrl: true, id: true })
    .parse(body);

  const transcribeClient = new TranscribeClient({
    region: "us-east-1",
    credentials: {
      accessKeyId: env.AWS_ACCESS_KEY_ID,
      secretAccessKey: env.AWS_SECRET_ACCESS_KEY,
    },
  });

  const updateRequestAsFailed = async () => {
    await updateSttStatusById({
      id: parsedBody.id,
      status: "failed",
    });
  };

  const fileName = parsedBody.audioUrl.split("/").pop();
  const transcriptionJobName = `transcribe-${parsedBody.id}`;

  const params = {
    TranscriptionJobName: transcriptionJobName,
    LanguageCode: LanguageCode.EN_US,
    Media: {
      MediaFileUri: `s3://${env.AWS_BUCKET_NAME}/${fileName}`,
    },
    OutputBucketName: env.AWS_BUCKET_NAME,
  };

  try {
    const response = await transcribeClient.send(
      new StartTranscriptionJobCommand(params),
    );

    if (!response?.TranscriptionJob?.TranscriptionJobName) {
      await updateRequestAsFailed();
      throw new Error("Failed to start transcription job");
    }

    let finishedJob = false;
    let attempts = 0;
    while (!finishedJob || attempts < 3) {
      //Sleep for 7 seconds to allow transcription job to finish
      await new Promise((resolve) => setTimeout(resolve, 7000));

      const { TranscriptionJobSummaries } = await transcribeClient.send(
        new ListTranscriptionJobsCommand({
          JobNameContains: transcriptionJobName,
        }),
      );

      if (
        !TranscriptionJobSummaries ||
        TranscriptionJobSummaries.length === 0
      ) {
        await updateRequestAsFailed();
        throw new Error("No transcription job found");
      }

      const job = TranscriptionJobSummaries[0];

      if (!job) {
        await updateRequestAsFailed();
        throw new Error("No transcription job found");
      }

      if (job.TranscriptionJobStatus === "COMPLETED") {
        finishedJob = true;
      }
      attempts += 1;
    }

    if (!finishedJob) {
      await updateRequestAsFailed();
      throw new Error("Transcription job did not complete");
    }

    //read from s3
    const url = await signUrl({
      url: `https://${env.AWS_BUCKET_NAME}.s3.amazonaws.com/${transcriptionJobName}.json`,
    });

    const transcriptionResponse = await fetch(url);
    const transcriptionData =
      (await transcriptionResponse.json()) as TranscriptionJob;

    console.log(transcriptionData);

    if (
      transcriptionData.results.transcripts.length === 0 ||
      !transcriptionData.results.transcripts[0]
    ) {
      await updateRequestAsFailed();
      throw new Error("No transcription data found");
    }

    const transcriptionText =
      transcriptionData.results.transcripts[0].transcript;

    const updatedTts = await updateSttStatusById({
      id: parsedBody.id,
      status: "finished",
      text: transcriptionText,
    });

    if (!updatedTts) {
      await updateRequestAsFailed();
      throw new Error("Failed to update STT status");
    }

    return NextResponse.json(
      { id: updatedTts.id, text: updatedTts.text, status: updatedTts.status },
      { status: 200 },
    );
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: e }, { status: 500 });
  }
}