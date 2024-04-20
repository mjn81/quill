import { z } from "zod";

export const deleteFileBodyValidator = z.object({
  id: z.string().min(1),
});