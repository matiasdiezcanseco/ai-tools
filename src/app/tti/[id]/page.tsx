import { revalidatePath } from "next/cache";
import { Button } from "~/components/ui/button";
import { getTtiRequestByUserById } from "~/server/tti";
import { BreadcrumbNavigation } from "~/components/breadcrumb-navigation";
import Image from "next/image";

const Navigation = ({ id }: { id: number }) => {
  return (
    <BreadcrumbNavigation
      list={[
        { text: "Home", href: "/" },
        { text: "Text to Image", href: "/tti" },
        { text: "Image", href: `/tti/${id}` },
      ]}
    />
  );
};

const TtiPageComponent = ({
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
            revalidatePath(`/tti/${id}`);
          }}
        >
          <Button type="submit">Reload</Button>
        </form>
      )}
    </div>
  );
};

export default async function TtiIdPage({
  params,
}: {
  params: { id: string };
}) {
  const idAsNumber = parseInt(params.id);

  if (typeof params.id !== "number" && isNaN(idAsNumber)) {
    return <TtiPageComponent id={idAsNumber} text="Not found" />;
  }

  const ttiRequest = await getTtiRequestByUserById(parseInt(params.id));

  if (!ttiRequest) {
    return <TtiPageComponent id={idAsNumber} text="Not found" />;
  }

  if (ttiRequest.status === "pending") {
    return <TtiPageComponent id={idAsNumber} text="Processing..." showForm />;
  }

  if (ttiRequest.status === "failed") {
    return <TtiPageComponent id={idAsNumber} text="Failed" />;
  }

  if (!ttiRequest.imageUrl) {
    return <TtiPageComponent id={idAsNumber} text="Failed" />;
  }

  return (
    <div className="space-y-8">
      <Navigation id={idAsNumber} />
      <p className="max-w-4xl">{ttiRequest.text}</p>
      <Image
        alt={ttiRequest.text}
        src={ttiRequest.imageUrl}
        width={512}
        height={512}
      />
    </div>
  );
}
