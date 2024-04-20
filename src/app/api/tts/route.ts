import { type NextRequest, NextResponse } from "next/server";
import { verifySignatureAppRouter } from "@upstash/qstash/dist/nextjs";

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

async function handler(_req: NextRequest) {
  await new Promise((r) => setTimeout(r, 1000));

  console.log("Success");
  return NextResponse.json({ name: "John Doe Serverless" });
}

export const POST = verifySignatureAppRouter(handler);
