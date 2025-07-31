import { ExerciseSession } from "@/utils/schema/ExerciseSession";
import { SetSession } from "@/utils/schema/SetSession";
import { WorkoutSession } from "@/utils/schema/WorkoutSession";
import { startTransition, useState } from "react";
import { WorkoutContext } from "./WorkoutContext";
import { ExerciseApi } from "@/utils/schema/Exercise";
import 'react-native-get-random-values';
import { v4 as uuidv4 } from "uuid";
import { getExerciseById } from "@/repositories/workouts/Exercise";
import { insertWorkout } from "@/repositories/workouts/Workout";


export interface EnrichedExerciseSession extends ExerciseSession {
  info: ExerciseApi | null
};


export const WorkoutProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isLive, setIsLive] = useState<boolean>(true);
  const [workout, setWorkout] = useState<WorkoutSession | null>(null);
  const [exercises, setExercises] = useState<EnrichedExerciseSession[]>([]);
  const [sets, setSets] = useState<Record<string, SetSession[]>>({});

  const startWorkout = async (exercises: string[] = [], isLive: boolean = false) => {
    const now = new Date().toISOString();
    const workoutId = uuidv4();
    const newWorkout: WorkoutSession = {
      id: workoutId,
      date: now,
      title: '',
      notes: ''
    };

    setWorkout(newWorkout);
    setIsLive(isLive);
    setExercises([]);

    for (let i = 0; i < exercises.length; i++) {
      await addExercise(exercises[i]);
    }

  };

  const addExercise = async (exerciseId: string) => {

    const exercise: ExerciseSession = {
      id: uuidv4(),
      workout_id: workout?.id ?? '',
      exercise_id: exerciseId,
      notes: '',
    };
    // console.log("inserting exercise:", exerciseId);

    // Insert the bare exercise first
    setExercises(prev => [...prev, { ...exercise, info: null }]);

    // Then enrich it once the info is available
    const exerciseInfo = await getExerciseById(exerciseId);
    // console.log(exerciseInfo);
    setExercises(prev =>
      prev.map(e =>
        e.exercise_id === exerciseId ? { ...e, info: exerciseInfo } : e
      )
    );
    addSet(exercise.id, 0);
  };

  const updateExercise = (updated: ExerciseSession) => {
    setExercises(prev => prev.map(e => e.id === updated.id ? {...e, updated} : e));
  };

  const removeExercise = (exerciseId: string) => {
    setExercises(prev => prev.filter(e => e.id !== exerciseId));
    setSets(prev => {
      const updated = { ...prev };
      delete updated[exerciseId];
      return updated;
    });
  };

  const addSet = (exerciseSessionId: string, insertAt: number) => {
    const newSet: SetSession = {
      id: uuidv4(),
      exercise_session_id: exerciseSessionId,
      notes: '',
      toRecord: true,
    };

    startTransition(() => {
      setSets(prev => {
        const existingSets = prev[exerciseSessionId] ?? [];
        const updated = [
          ...existingSets.slice(0, insertAt),
          newSet,
          ...existingSets.slice(insertAt)
        ];
        return {
          ...prev,
          [exerciseSessionId]: updated,
        };
      });
    })
  };

  const updateSet = (
    exerciseSessionId: string,
    setIndex: number,
    updatedSet: Partial<SetSession>
  ) => {
    setSets(prev => ({
      ...prev,
      [exerciseSessionId]: prev[exerciseSessionId].map((s, i) =>
        i === setIndex ? { ...s, ...updatedSet } : s
      ),
    }));
  };

  const removeSet = (
    exerciseSessionId: string,
    setIndex: number,
  ): number | undefined => {
    let newSelectedIndex: number | undefined = undefined;

    setSets(prev => {
      const currentSets = prev[exerciseSessionId];
      if (!currentSets) return prev;

      const updatedSets = [...currentSets];

      if (updatedSets.length === 1) {
        updatedSets[0] = {
          ...updatedSets[0],
          notes: '',
          rir: undefined,
          reps: undefined,
          weight: undefined,
        };
        newSelectedIndex = 0;
        return { ...prev, [exerciseSessionId]: updatedSets };
      }

      updatedSets.splice(setIndex, 1);

      newSelectedIndex = updatedSets[setIndex] ? setIndex : (setIndex > 0 ? setIndex - 1 : 0);

      return {
        ...prev,
        [exerciseSessionId]: updatedSets,
      };
    });

    return newSelectedIndex;
  };

  const cancelWorkout = () => {
    setWorkout(null);
    // setExercises([]);
    // setSets([]);
    // ONLY DELETING WORKOUT FOR TESTING RIGHT NOW!!
  }

  const pushWorkout = async () => {
    if (!workout) return;

    const now = Date.now();
    const start = new Date(workout.date).getTime();
    const duration = Math.floor((now - start) / 1000); // in seconds

    const toPush = {
      ...workout,
      duration,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      setsCount: Object.values(sets).reduce((acc, curr) => acc + curr.length, 0),
      exercisesCount: exercises.length,
      muscleDistribution: {}
    };

    insertWorkout(toPush);

    setWorkout(null);
    // setExercises([]);
    // setSets([]);
    // ONLY INSERTING WORKOUT FOR TESTING RIGHT NOW!!

  };

  return (
    <WorkoutContext.Provider
      value={{
        isLive,
        workout,
        exercises,
        sets,
        startWorkout,
        pushWorkout,
        cancelWorkout,
        setWorkout,
        addExercise,
        updateExercise,
        removeExercise,
        addSet,
        updateSet,
        removeSet,
      }}
    >
      {children}
    </WorkoutContext.Provider>
  );
};