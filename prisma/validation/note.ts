import { z } from "zod";

export const createNotesSchema = z.object({
  title: z.string().min(1, { message: "Title is required" }).max(255),
  content: z.string().optional(),
});

export type CreateNote = z.infer<typeof createNotesSchema>;

export const updateNotesSchema = createNotesSchema.extend({
  id: z.string().min(1)
});

export const deleteNotesSchema  = z.object({
  id: z.string().min(1)
});
