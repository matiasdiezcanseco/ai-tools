import clsx from "clsx";
import Link from "next/link";
import { type FC } from "react";
import { Button } from "~/components/ui/button";
import { type SelectTts } from "~/server/db/schema";

const TtsCard: FC<{ tts: SelectTts }> = ({ tts }) => {
  const statusClassname = clsx({
    "text-green-600": tts.status === "finished",
    "text-muted": tts.status === "pending",
    "text-destructive": tts.status === "failed",
  });

  return (
    <div className="flex flex-col gap-2 rounded-lg border p-4">
      <p>#{tts.id}</p>
      <p>
        Status: <span className={statusClassname}>{tts.status}</span>
      </p>
      <p>
        Text: <span className="text-muted">{tts.text.slice(0, 20)}...</span>
      </p>
      {tts.audioUrl && (
        <Link className="flex flex-grow items-end" href={`/tts/${tts.id}`}>
          <Button variant="default">Audio</Button>
        </Link>
      )}
    </div>
  );
};

export default TtsCard;
