import { revalidatePath } from "next/cache";
import { Button } from "~/components/ui/button";
import { BreadcrumbNavigation } from "~/components/breadcrumb-navigation";
import { signUrl } from "~/server/s3";
import { getSttRequestByUserById } from "~/server/stt";

const Navigation = ({ id }: { id: number }) => {
  return (
    <BreadcrumbNavigation
      list={[
        { text: "Home", href: "/" },
        { text: "Speach to Text", href: "/stt" },
        { text: "Text", href: `/stt/${id}` },
      ]}
    />
  );
};

const SttPageComponent = ({
  id,
  text,
  showForm = false,
  audioUrl,
}: {
  id: number;
  text: string;
  showForm?: boolean;
  audioUrl?: string;
}) => {
  return (
    <div className="flex flex-col gap-4">
      <Navigation id={id} />
      <p>{text}</p>
      {audioUrl && <audio controls src={audioUrl}></audio>}
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
    return <SttPageComponent id={idAsNumber} text="Not found" />;
  }

  const sttRequest = await getSttRequestByUserById(parseInt(params.id));

  if (!sttRequest) {
    return <SttPageComponent id={idAsNumber} text="Not found" />;
  }

  const signedUrl = await signUrl({ url: sttRequest.audioUrl });

  if (sttRequest.status === "pending") {
    return (
      <SttPageComponent
        id={idAsNumber}
        text="Processing..."
        showForm
        audioUrl={signedUrl}
      />
    );
  }

  if (sttRequest.status === "failed") {
    return (
      <SttPageComponent id={idAsNumber} text="Failed" audioUrl={signedUrl} />
    );
  }

  if (!signedUrl) {
    return (
      <SttPageComponent id={idAsNumber} text="Failed" audioUrl={signedUrl} />
    );
  }

  return (
    <div className="space-y-8">
      <Navigation id={idAsNumber} />
      <p className="max-w-4xl">{sttRequest.text}</p>
      <audio controls src={signedUrl}></audio>
    </div>
  );
}
