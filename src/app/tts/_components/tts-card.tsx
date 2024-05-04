import Link from "next/link";
import { type FC } from "react";
import { Button } from "~/components/ui/button";
import { type SelectTts } from "~/server/db/schema";

const TtsCard: FC<{ tts: SelectTts }> = ({ tts }) => {
  return (
    <div className="space-y-2 rounded-lg border p-4">
      <p>#{tts.id}</p>
      <p>Status: {tts.status}</p>
      <p>Text: {tts.text.slice(0, 20)}...</p>
      {tts.audioUrl && (
        <Link href={`/tts/${tts.id}`}>
          <Button variant="default">Download Audio</Button>
        </Link>
      )}
    </div>
  );
};

export default TtsCard;
