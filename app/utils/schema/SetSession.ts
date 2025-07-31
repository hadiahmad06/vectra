import { z } from 'zod';

export const SetSessionSchema = z.object({
  id: z.string().uuid(),
  exercise_session_id: z.string().uuid(),
  // idx: z.number().min(1),
  order: z.number().min(1),
  weight: z.number().min(0).optional(),
  reps: z.number().min(0).optional(),
  toRecord: z.boolean(),
  rir: z.number().optional(),
  notes: z.string().default(''),
//   created_at: z.string().datetime(),
//   updated_at: z.string().datetime(),
});

export type CompleteSetSession = z.infer<typeof SetSessionSchema>;

export type SetSession = Omit<CompleteSetSession, 'order'> & {
  order?: number,
  // id?: string;
  // exercise_session_id?: string;
};
