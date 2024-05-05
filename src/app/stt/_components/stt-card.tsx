import clsx from "clsx";
import Link from "next/link";
import { type FC } from "react";
import { Button } from "~/components/ui/button";
import { type SelectStt } from "~/server/db/schema";

const SttCard: FC<{ stt: SelectStt }> = ({ stt }) => {
  const statusClassname = clsx({
    "text-green-600": stt.status === "finished",
    "text-muted": stt.status === "pending",
    "text-destructive": stt.status === "failed",
  });

  return (
    <div className="flex flex-col gap-2 rounded-lg border p-4">
      <p>#{stt.id}</p>
      <p>
        Status: <span className={statusClassname}>{stt.status}</span>
      </p>
      {stt.text && (
        <Link className="flex flex-grow items-end" href={`/stt/${stt.id}`}>
          <Button variant="default">Text</Button>
        </Link>
      )}
    </div>
  );
};

export default SttCard;
