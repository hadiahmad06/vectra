import { ExerciseSession, ExerciseSessionSchema } from '@/utils/schema/ExerciseSession';
import { SetSession, SetSessionSchema } from '@/utils/schema/SetSession';
import { WorkoutSession, WorkoutSessionSchema } from '@/utils/schema/WorkoutSession';
import React, { createContext, useContext, useState } from 'react';
import { z } from 'zod';
import { EnrichedExerciseSession } from './WorkoutProvider';

type WorkoutContextType = {
  isLive: boolean;
  workout: WorkoutSession | null;
  exercises: EnrichedExerciseSession[];
  sets: Record<string, SetSession[]>; // key = exercise_session_id
  setWorkout: (workout: WorkoutSession | null) => void;
  startWorkout: (exercises?: string[], isLive?: boolean) => Promise<void>;
  pushWorkout: () => Promise<void>;
  cancelWorkout: () => void;
  addExercise: (exerciseId: string) => void;
  updateExercise: (exercise: ExerciseSession) => void;
  removeExercise: (exerciseId: string) => void;
  addSet: (exerciseSessionId: string, order: number) => void;
  updateSet: (exerciseSessionId: string, setIndex: number, updatedSet: Partial<SetSession>) => void;
  removeSet: (exerciseSessionId: string, setIndex: number, setSelected?: (newSelected: number) => void) => void;
};

export const WorkoutContext = createContext<WorkoutContextType | undefined>(undefined);

export const useWorkout = () => {
  const context = useContext(WorkoutContext);
  if (!context) throw new Error('useWorkout must be used within a WorkoutProvider');
  return context;
};