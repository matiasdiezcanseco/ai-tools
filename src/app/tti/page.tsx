import { Button } from "~/components/ui/button";
import { RefreshCcw } from "lucide-react";
import { revalidatePath } from "next/cache";
import { BreadcrumbNavigation } from "~/components/breadcrumb-navigation";
import TtiForm from "./_components/tti-form";
import TtiRequestsDisplay from "./_components/tti-requests";
import { getTtiRequestsByUser } from "~/server/tti";

export default async function TtiPage() {
  const ttiRequests = await getTtiRequestsByUser();

  const orderedRequests = ttiRequests.sort((a, b) => {
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  return (
    <div className="space-y-8">
      <div className="flex items-start justify-between">
        <BreadcrumbNavigation
          list={[
            { text: "Home", href: "/" },
            { text: "Text to Image", href: "/tti" },
          ]}
        />
        <form
          action={async () => {
            "use server";
            revalidatePath("/tti");
          }}
        >
          <Button variant="outline" type="submit">
            <RefreshCcw size={18} />
          </Button>
        </form>
      </div>
      <TtiForm />
      <TtiRequestsDisplay requests={orderedRequests} />
    </div>
  );
}
