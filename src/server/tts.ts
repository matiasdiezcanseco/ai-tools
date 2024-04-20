import "server-only";

export const getTtsRequestsByUserId = async (id: string) => {
  return [
    { status: "pending", id, text: "Translation 1", audio: undefined },
    { status: "finished", id: "2", text: "Translation 1", audio: "audio.mp3" },
  ];
};
