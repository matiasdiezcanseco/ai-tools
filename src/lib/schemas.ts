import { z } from "zod";

export const sttFormSchema = z.object({
  file: z.instanceof(File, { message: "Please upload a file." }),
});

export const ttsFormSchema = z.object({
  text: z.string().min(2).max(500),
});

export const signUrlSchema = z.object({
  id: z.number(),
  type: z.enum(["tts"]),
});

export type SignUrl = z.infer<typeof signUrlSchema>;
