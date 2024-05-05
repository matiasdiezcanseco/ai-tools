import { Button } from "~/components/ui/button";
import { RefreshCcw } from "lucide-react";
import { revalidatePath } from "next/cache";
import { BreadcrumbNavigation } from "~/components/breadcrumb-navigation";
import SttForm from "./_components/stt-form";

export default async function TtsPage() {
  return (
    <div className="space-y-8">
      <div className="flex items-start justify-between">
        <BreadcrumbNavigation
          list={[
            { text: "Home", href: "/" },
            { text: "Speach to Text", href: "/stt" },
          ]}
        />
        <form
          action={async () => {
            "use server";
            revalidatePath("/stt");
          }}
        >
          <Button variant="outline" type="submit">
            <RefreshCcw size={18} />
          </Button>
        </form>
      </div>
      <SttForm />
      {/* <TtsRequestsDisplay requests={orderedRequests} /> */}
    </div>
  );
}
