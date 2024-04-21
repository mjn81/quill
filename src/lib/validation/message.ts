import { z } from "zod";

export const bodyMessageValidator = z.object({
  fileId: z.string().min(1),
  message: z.string().min(1),
});

export const getMessageValidator = z.object({
  fileId: z.string().min(1),
  limit: z.number().min(1).max(100).optional(),
  cursor: z.number().optional(),
});