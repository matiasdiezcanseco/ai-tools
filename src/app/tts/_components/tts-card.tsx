import { type FC } from "react";
import { type SelectTts } from "~/server/db/schema";
import DisplayAudio from "./display-audio";

const TtsCard: FC<{ tts: SelectTts }> = ({ tts }) => {
  return (
    <div className="space-y-2 rounded-lg border p-4">
      <p>#{tts.id}</p>
      <p>Status: {tts.status}</p>
      <p>Text: {tts.text.slice(0, 20)}...</p>
      {tts.audioUrl && <DisplayAudio id={tts.id} />}
    </div>
  );
};

export default TtsCard;
