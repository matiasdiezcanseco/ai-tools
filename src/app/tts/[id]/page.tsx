import { revalidatePath } from "next/cache";
import { Button } from "~/components/ui/button";
import { signUrl } from "~/server/sign-url";
import { getTtsRequestByUserById } from "~/server/tts";
import { BreadcrumbNavigation } from "~/components/breadcrumb-navigation";

const Navigation = ({ id }: { id: number }) => {
  return (
    <BreadcrumbNavigation
      list={[
        { text: "Home", href: "/" },
        { text: "Text to Speach", href: "/tts" },
        { text: "Audio", href: `/tts/${id}` },
      ]}
    />
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
    <div className="flex flex-col gap-4">
      <Navigation id={id} />
      <p>{text}</p>
      {showForm && (
        <form
          action={async () => {
            "use server";
            revalidatePath(`/tts/${id}`);
          }}
        >
          <Button type="submit">Reload</Button>
        </form>
      )}
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
      <Navigation id={idAsNumber} />
      <p className="max-w-4xl">{ttsRequest.text}</p>
      <audio controls src={signedUrl}></audio>
    </div>
  );
}
