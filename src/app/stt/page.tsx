import { Button } from "~/components/ui/button";
import { RefreshCcw } from "lucide-react";
import { revalidatePath } from "next/cache";
import { BreadcrumbNavigation } from "~/components/breadcrumb-navigation";
import SttForm from "./_components/stt-form";
import SttRequestsDisplay from "./_components/stt-requests";
import { getSttRequestsByUser } from "~/server/stt";

export default async function SttPage() {
  const sttRequests = await getSttRequestsByUser();

  const orderedRequests = sttRequests.sort((a, b) => {
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

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
      <SttRequestsDisplay requests={orderedRequests} />
    </div>
  );
}
