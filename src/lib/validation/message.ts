import { z } from "zod";

export const bodyMessageValidator = z.object({
  fileId: z.string().min(1),
  message: z.string().min(1),
});