import { z } from 'zod';

export const leadSchema = z.object({
  id: z.string(),
  name: z.string(),
  stage: z.string(),
});

export const leadListSchema = z.array(leadSchema);

export type Lead = z.infer<typeof leadSchema>;
