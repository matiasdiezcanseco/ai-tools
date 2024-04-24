import { NextResponse } from "next/server";
import { type SelectTts, selectTtsSchema } from "~/server/db/schema";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const body = (await request.json()) as SelectTts;

  const parsedBody = selectTtsSchema.parse(body);

  console.log(parsedBody);

  return NextResponse.json({ parsedBody }, { status: 201 });
}
