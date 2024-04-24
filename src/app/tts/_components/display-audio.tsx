"use client";

import axios from "axios";
import { type FC, useState } from "react";
import { type SignUrlResponse } from "~/app/api/sign-url/route";
import { Button } from "~/components/ui/button";
import { type SignUrl } from "~/lib/schemas";

type DisplayAudioProps = {
  id: number;
};

const DisplayAudio: FC<DisplayAudioProps> = ({ id }) => {
  const [audio, setAudio] = useState<string>("");
  const [loading, setLoading] = useState(false);

  const downloadAudio = async () => {
    setLoading(true);
    const response = await axios.post<SignUrlResponse>("/api/sign-url", {
      id,
      type: "tts",
    } as SignUrl);
    const url = response.data.url;

    const audioResponse = await axios.put(
      url,
      {},
      { headers: { "Content-Type": "audio/mp3" } },
    );
    setLoading(false);
    console.log(audioResponse);
  };

  return (
    <>
      {!audio && (
        <Button variant="default" onClick={downloadAudio} disabled={loading}>
          Download Audio
        </Button>
      )}
      {audio && <audio controls></audio>}
    </>
  );
};

export default DisplayAudio;
