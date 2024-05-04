import Link from "next/link";
import { type FC } from "react";
import { Button } from "~/components/ui/button";
import { type SelectTts } from "~/server/db/schema";

const TtsCard: FC<{ tts: SelectTts }> = ({ tts }) => {
  return (
    <div className="flex flex-col gap-2 rounded-lg border p-4">
      <p>#{tts.id}</p>
      <p>Status: {tts.status}</p>
      <p>Text: {tts.text.slice(0, 20)}...</p>
      {tts.audioUrl && (
        <Link className="flex flex-grow items-end" href={`/tts/${tts.id}`}>
          <Button variant="default">Audio</Button>
        </Link>
      )}
    </div>
  );
};

export default TtsCard;
