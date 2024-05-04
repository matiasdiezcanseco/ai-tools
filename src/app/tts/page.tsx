import { getTtsRequestsByUser } from "~/server/tts";
import TtsForm from "./_components/tts-form";
import { Button } from "~/components/ui/button";
import { RefreshCcw } from "lucide-react";
import { revalidatePath } from "next/cache";
import { BreadcrumbNavigation } from "~/components/breadcrumb-navigation";
import TtsRequestsDisplay from "./_components/tts-requests";

export default async function TtsPage() {
  const ttsRequests = await getTtsRequestsByUser();

  const orderedRequests = ttsRequests.sort((a, b) => {
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

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
      <TtsRequestsDisplay requests={orderedRequests} />
    </div>
  );
}
