import { revalidatePath } from "next/cache";
import Link from "next/link";
import { Button } from "~/components/ui/button";
import { signUrl } from "~/server/sign-url";
import { getTtsRequestByUserById } from "~/server/tts";
import { ChevronLeft } from "lucide-react";

const Navigation = () => {
  return (
    <Link href="/tts" className="flex items-center gap-2">
      <ChevronLeft />
      Text to Speach
    </Link>
  );
};

const TtsPageComponent = ({
  id,
  text,
  showForm = false,
}: {
  id: number;
  text: string;
  showForm?: boolean;
}) => {
  return (
    <div>
      <Navigation />
      {showForm && (
        <form
          action={async () => {
            "use server";
            revalidatePath(`/tts/${id}`);
          }}
        >
          <Button type="submit">Update</Button>
        </form>
      )}
      <p>{text}</p>
    </div>
  );
};

export default async function TtsIdPage({
  params,
}: {
  params: { id: string };
}) {
  const idAsNumber = parseInt(params.id);

  if (typeof params.id !== "number" && isNaN(idAsNumber)) {
    return <TtsPageComponent id={idAsNumber} text="Not found" />;
  }

  const ttsRequest = await getTtsRequestByUserById(parseInt(params.id));

  if (!ttsRequest) {
    return <TtsPageComponent id={idAsNumber} text="Not found" />;
  }

  if (ttsRequest.status === "pending") {
    return <TtsPageComponent id={idAsNumber} text="Processing..." showForm />;
  }

  if (ttsRequest.status === "failed") {
    return <TtsPageComponent id={idAsNumber} text="Failed" />;
  }

  const signedUrl = await signUrl({ url: ttsRequest.audioUrl ?? "" });

  if (!signedUrl) {
    return <TtsPageComponent id={idAsNumber} text="Failed" />;
  }

  return (
    <div className="space-y-8">
      <Navigation />
      <p className="max-w-4xl">{ttsRequest.text}</p>
      <audio controls src={signedUrl}></audio>
    </div>
  );
}
