import clsx from "clsx";
import Link from "next/link";
import { type FC } from "react";
import { Button } from "~/components/ui/button";
import { type SelectTti } from "~/server/db/schema";

const TtiCard: FC<{ tti: SelectTti }> = ({ tti }) => {
  const statusClassname = clsx({
    "text-green-600": tti.status === "finished",
    "text-muted": tti.status === "pending",
    "text-destructive": tti.status === "failed",
  });

  return (
    <div className="flex flex-col gap-2 rounded-lg border p-4">
      <p>#{tti.id}</p>
      <p>
        Status: <span className={statusClassname}>{tti.status}</span>
      </p>
      <p>
        Text: <span className="text-muted">{tti.text.slice(0, 20)}...</span>
      </p>
      {tti.imageUrl && (
        <Link className="flex flex-grow items-end" href={`/tti/${tti.id}`}>
          <Button variant="default">Image</Button>
        </Link>
      )}
    </div>
  );
};

export default TtiCard;
