import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const body = (await request.json()) as object;

  console.log(body);

  return NextResponse.json({ body }, { status: 201 });
}
