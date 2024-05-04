import { getTtsRequestsByUser } from "~/server/tts";
import TtsForm from "./_components/tts-form";
import TtsCard from "./_components/tts-card";
import { Button } from "~/components/ui/button";
import { RefreshCcw } from "lucide-react";
import { revalidatePath } from "next/cache";
import { BreadcrumbNavigation } from "~/components/breadcrumb-navigation";

export default async function TtsPage() {
  const ttsRequests = await getTtsRequestsByUser();

  return (
    <div className="space-y-8">
      <div className="flex items-start justify-between">
        <BreadcrumbNavigation
          list={[
            { text: "Home", href: "/" },
            { text: "Text to Speach", href: "/tts" },
          ]}
        />
        <form
          action={async () => {
            "use server";
            revalidatePath("/tts");
          }}
        >
          <Button variant="outline" type="submit">
            <RefreshCcw size={18} />
          </Button>
        </form>
      </div>
      <TtsForm />
      <h3 className="text-2xl font-semibold">Requests</h3>
      <div className="grid grid-cols-3 gap-2">
        {ttsRequests.map((request) => (
          <TtsCard key={request.id} tts={request} />
        ))}
      </div>
    </div>
  );
}
