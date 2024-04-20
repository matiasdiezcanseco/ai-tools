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
  const formData = await request.formData();
  const text = formData.get("text");

  return Response.json({
    status: "pending",
    id: "3",
    text,
    audio: undefined,
  } as TtsStatus);
}
