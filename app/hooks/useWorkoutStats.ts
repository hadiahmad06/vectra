import { useEffect, useMemo, useState } from "react";
import { CompleteWorkoutSession } from "@/utils/schema/WorkoutSession";
import { useHistory } from "@/contexts/HistoryContext";
import "date-fns";
import { addDays, addMonths, addWeeks, addYears, endOfDay, endOfMonth, endOfWeek, endOfYear, isBefore, startOfDay, startOfMonth, startOfWeek, startOfYear } from "date-fns";

export function useWorkoutStats(
  startDate: Date,
  endDate: Date,
  bucketBy: 'day' | 'week' | 'month' | 'year',
  averagePer?: 'day' | 'week' | 'month' | 'year'
) {
  const { getWorkoutsInRange } = useHistory();
  const [workouts, setWorkouts] = useState<CompleteWorkoutSession[]>([]);

  useEffect(() => {
    getWorkoutsInRange(startDate, endDate).then(setWorkouts);
  }, [startDate.getTime(), endDate?.getTime()]);

  return useMemo(() => {
    const sumSets = (workouts: CompleteWorkoutSession[]) =>
      workouts.reduce((acc, w) => acc + (w.setsCount || 0), 0);

    const sumDuration = (workouts: CompleteWorkoutSession[]) =>
      workouts.reduce((acc, w) => acc + (w.duration || 0), 0);

    const sumExercises = (workouts: CompleteWorkoutSession[]) =>
      workouts.reduce((acc, w) => acc + (w.exercisesCount || 0), 0);

    // date-fns imports for date manipulation
    // (assume they are imported at the top of the file)
    // import {
    //   startOfMonth, endOfMonth, startOfWeek, endOfWeek, startOfDay, endOfDay, startOfYear, endOfYear,
    //   addMonths, addWeeks, addDays, addYears, isBefore
    // } from "date-fns";

    function getIntervalBounds(start: Date, end: Date, interval: 'day' | 'week' | 'month' | 'year') {
      let startFn, endFn, addFn;
      switch (interval) {
        case 'day':
          startFn = startOfDay;
          endFn = endOfDay;
          addFn = addDays;
          break;
        case 'week':
          startFn = startOfWeek;
          endFn = endOfWeek;
          addFn = addWeeks;
          break;
        case 'month':
          startFn = startOfMonth;
          endFn = endOfMonth;
          addFn = addMonths;
          break;
        case 'year':
          startFn = startOfYear;
          endFn = endOfYear;
          addFn = addYears;
          break;
      }

      let ranges: { start: Date; end: Date }[] = [];
      let cursor = startFn(start);
      const final = endFn(end);

      while (isBefore(cursor, final) || cursor.getTime() === final.getTime()) {
        const rangeStart = startFn(cursor);
        const rangeEnd = endFn(cursor);
        ranges.push({ start: rangeStart, end: rangeEnd });
        cursor = addFn(cursor, 1);
      }

      return ranges;
    }

    const ranges = getIntervalBounds(startDate, endDate, bucketBy);

    const averageUnitDivisor = (() => {
      switch (averagePer) {
        case 'day': return 1;
        case 'week': return 7;
        case 'month': return 30;
        case 'year': return 365;
        default: return 7;
      }
    })();

    const avgByRange = (
      accessor: (w: CompleteWorkoutSession) => number
    ) =>
      ranges.map(({ start, end }) => {
        const inRange = workouts.filter(
          (w) =>
            new Date(w.date) >= start && new Date(w.date) <= end
        );
        const total = inRange.reduce((acc, w) => acc + accessor(w), 0);
        return total / averageUnitDivisor; // placeholder divisor for now
      });

    return {
      getSets: () => sumSets(workouts),
      getDuration: () => sumDuration(workouts),
      getExercises: () => sumExercises(workouts),
      getWorkouts: workouts.length,
      avgSets: avgByRange((w) => w.setsCount || 0),
      avgDuration: avgByRange((w) => w.duration || 0),
      avgExercises: avgByRange((w) => w.exercisesCount || 0),
      avgWorkouts: workouts.length / averageUnitDivisor,
    };
  }, [workouts, bucketBy, averagePer]);
}