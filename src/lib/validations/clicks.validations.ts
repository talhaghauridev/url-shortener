import * as z from "zod";

export const GetClicksForUrlsValidation = z.object({
  urlIds: z.array(z.string()),
});

export const StoreClicksValidation = z.object({
  id: z.string(),
  user_agent: z.string(),
});
