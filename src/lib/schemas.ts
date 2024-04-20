import { z } from "zod";

export const ttsFormSchema = z.object({
  text: z.string().min(2).max(500),
});
