import { z } from 'zod';

export enum MuscleGroup {
  chest,
  back,
  shoulders,
  glutes,
  legs,
  core,
  biceps,
  triceps
}

const MuscleGroupKeys = Object.keys(MuscleGroup).filter(k => isNaN(Number(k))) as [string, ...string[]];

export const WorkoutSessionSchema = z.object({
  id: z.string().uuid(),
  date: z.string().datetime(),
  duration: z.number().int().min(0), // Duration in seconds
  title: z.string().default(''),
  notes: z.string().default(''),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
  setsCount: z.number().int().min(1),
  exercisesCount: z.number().int().min(1),
  muscleDistribution: z.record(
    z.enum(MuscleGroupKeys),
    z.number().int().min(0)
  ),
});

export type CompleteWorkoutSession = z.infer<typeof WorkoutSessionSchema>;

export type WorkoutSession = Omit<CompleteWorkoutSession, 'duration' | 'created_at' | 'updated_at' | 'setsCount' | 'exercisesCount' | 'muscleDistribution'> & {
  // id?: string;
  duration?: number;
  created_at?: string;
  updated_at?: string;
  setsCount?: number;
  exercisesCount?: number;
  muscleDistribution?: { [muscle in keyof typeof MuscleGroup]: number }[];
};

// for octagon chart
