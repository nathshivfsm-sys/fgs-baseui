import { z } from 'zod';

export const workorderSchema = z.object({
  id: z.string(),
  title: z.string(),
  status: z.string(),
});

export const workorderListSchema = z.array(workorderSchema);

export type Workorder = z.infer<typeof workorderSchema>;
