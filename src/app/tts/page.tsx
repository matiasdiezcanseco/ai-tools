import { getTtsRequestsByUser } from "~/server/tts";
import TtsForm from "./_components/tts-form";

export default async function TtsPage() {
  const ttsRequests = await getTtsRequestsByUser();

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-semibold">Text to Speach</h2>
      <TtsForm />
      <h3 className="text-lg font-semibold">Requests</h3>
      <div className="grid grid-cols-3 gap-2">
        {ttsRequests.map((request) => (
          <div key={request.id} className="space-y-2 rounded-lg border p-4">
            <p>#{request.id}</p>
            <p>Status: {request.status}</p>
            <p>Text: {request.text.slice(0, 20)}...</p>
            {request.audioUrl && <audio src={request.audioUrl} controls />}
          </div>
        ))}
      </div>
    </div>
  );
}
