import { z } from "zod";

export const ttsFormSchema = z.object({
  text: z.string().min(2).max(500),
});

export const signUrlSchema = z.object({
  id: z.number(),
  type: z.enum(["tts"]),
});

export type SignUrl = z.infer<typeof signUrlSchema>;
