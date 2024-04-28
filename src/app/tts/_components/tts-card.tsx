"use client";

import { useEffect, useState, type FC } from "react";
import { type SelectTts } from "~/server/db/schema";
import DisplayAudio from "./display-audio";
import axios from "axios";

const TtsCard: FC<{ tts: SelectTts }> = ({ tts }) => {
  const maxCalls = 3;
  const [internalTts, setInternalTts] = useState(tts);
  const [intervalId, setIntervalId] = useState<NodeJS.Timeout>();
  const [callCount, setCallCount] = useState(0);

  const fetchTtsData = async () => {
    try {
      const response = await axios.get<SelectTts>(`/api/tts/${internalTts.id}`);
      setInternalTts(response.data);
    } catch (error) {}
  };

  useEffect(() => {
    const startPolling = () => {
      const intervalIdAux = setInterval(() => {
        void fetchTtsData();
        setCallCount((prev) => prev + 1);
      }, 5000);
      setIntervalId(intervalIdAux);
    };

    startPolling();

    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    if (internalTts && ["finished", "error"].includes(internalTts.status)) {
      clearInterval(intervalId);
    }
    if (callCount >= maxCalls) {
      clearInterval(intervalId);
    }
  }, [internalTts, intervalId, callCount]);

  return (
    <div className="space-y-2 rounded-lg border p-4">
      <p>#{internalTts.id}</p>
      <p>Status: {internalTts.status}</p>
      <p>Text: {internalTts.text.slice(0, 20)}...</p>
      {internalTts.audioUrl && <DisplayAudio id={internalTts.id} />}
    </div>
  );
};

export default TtsCard;
