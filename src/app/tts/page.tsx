import { getTtsRequestsByUser } from "~/server/tts";
import TtsForm from "./_components/tts-form";
import TtsCard from "./_components/tts-card";

export default async function TtsPage() {
  const ttsRequests = await getTtsRequestsByUser();

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-semibold">Text to Speach</h2>
      <TtsForm />
      <h3 className="text-lg font-semibold">Requests</h3>
      <div className="grid grid-cols-3 gap-2">
        {ttsRequests.map((request) => (
          <TtsCard key={request.id} tts={request} />
        ))}
      </div>
    </div>
  );
}
