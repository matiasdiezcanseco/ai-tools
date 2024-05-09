import { Button } from "~/components/ui/button";
import { RefreshCcw } from "lucide-react";
import { revalidatePath } from "next/cache";
import { BreadcrumbNavigation } from "~/components/breadcrumb-navigation";
import TtiForm from "./_components/tti-form";

export default async function TtiPage() {
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
    </div>
  );
}
