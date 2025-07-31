import { useState, useEffect, useRef } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { MotiView } from 'moti';

import { FontAwesome } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

import { Text } from '@/components/Themed';
import Toggle from '@/components/common/Toggle';
import { useWorkout } from '@/contexts/WorkoutContext';
import { useHistory } from '@/contexts/HistoryContext';

import { format, isToday, setWeek } from 'date-fns';
import { CompleteWorkoutSession } from '@/utils/schema/WorkoutSession';
import { Easing } from 'react-native-reanimated';
import { WeekCarousel } from '@/components/today/WeekCarousel';

type WorkoutDayStatus = {
  date: string;
  completed: boolean;
}

export default function TabOneScreen() {
  const { workouts, getWorkoutsInRange } = useHistory()
  const { workout, startWorkout, cancelWorkout } = useWorkout();
  const router = useRouter();

  const [selectedToggle, setSelectedToggle] = useState<'today' | 'week'>('today');
  const [selectedDateOffset, setSelectedDateOffset] = useState(new Date().getDay());
  const [startOfWeek, setStartOfWeek] = useState(() => {
    const now = new Date();
    now.setDate(now.getDate() - now.getDay());
    now.setHours(0, 0, 0, 0);
    return now;
  });

  const [loadedWorkouts, setLoadedWorkouts] = useState<CompleteWorkoutSession[] | null>(null);

  const selectedDate = new Date(startOfWeek);
  selectedDate.setDate(startOfWeek.getDate() + selectedDateOffset);
  
  const fetchWorkoutsInRange = async () => {
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);
    endOfWeek.setHours(23, 59, 59, 999);

    const res = await getWorkoutsInRange(startOfWeek, endOfWeek);
    return res;
  };

  useEffect(() => {
    if (selectedToggle === 'today') {
      const startDate = new Date(selectedDate);
      getWorkoutsInRange( startDate ).then((res) => {
        setLoadedWorkouts(res);
      });
    } else {
      fetchWorkoutsInRange().then((res) => {
        setLoadedWorkouts(res);
      });
    }
  }, [startOfWeek, selectedToggle, selectedDateOffset]);

  const formattedTitle = isToday(selectedDate)
    ? 'Today'
    : format(selectedDate, 'EEEE, MMMM d');

  const totalDuration = loadedWorkouts?.reduce((acc, w) => acc + w.duration, 0) ?? 0;
  const totalSets = loadedWorkouts?.reduce((acc, w) => acc + w.setsCount, 0) ?? 0;
  const totalExercises = loadedWorkouts?.reduce((acc, w) => acc + w.exercisesCount, 0) ?? 0;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{formattedTitle}</Text>
      <WeekCarousel 
        startOfWeek={startOfWeek} 
        setStartOfWeek={setStartOfWeek} 
        selectedDateOffset={selectedDateOffset} 
        setSelectedDateOffset={setSelectedDateOffset}
        fetchWorkoutsInRange={fetchWorkoutsInRange}
      />
      <View style={styles.summaryContainer}>
        <View style={styles.summaryHeader}>
          <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#fff' }}>Summary</Text>
          <Toggle
            options={[
              { key: 'today', label: 'Today' },
              { key: 'week', label: 'Week', disabled: false },
            ]}
            selected={selectedToggle}
            onChange={(val) => setSelectedToggle(val as 'today' | 'week')}
            width={70}
          />
        </View>


        {loadedWorkouts && (
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 12 }}>
            <Text style={{ fontSize: 14, color: '#ccc', fontWeight: 600}}>
              {totalDuration ? `${Math.floor(totalDuration / 60) > 0 ? `${Math.floor(totalDuration / 60)} hr` : ''}${totalDuration % 60 > 0 ? ` ${totalDuration % 60} min` : ''}` : '0 min'}
              {` • ${loadedWorkouts.length} Workout${loadedWorkouts.length !== 1 ? 's' : ''} • ${totalExercises} Exercise${totalExercises !== 1 ? 's' : ''} • ${totalSets} Set${totalSets !== 1 ? 's' : ''}`}
            </Text>
          </View>
        )}

        <View style={styles.summaryCard}>
          <Text style={styles.summaryLabel}>[Muscle Diagram]</Text>
        </View>

        <View style={styles.summaryHex}>
          <Text style={styles.summaryLabel}>[Hexagon Chart]</Text>
        </View>
        
        { !workout ? (
          <View style={styles.actionRow}>
            {!isToday(selectedDate) && (
              <TouchableOpacity 
                onPress={async () => {
                  router.push('/(tabs)/today/workout-session')
                  await startWorkout(['Barbell Bench Press'], false);
                }}
                style={styles.actionButtonSecondary}
              >
                <Text style={styles.actionButtonText}>
                  Log Workout {format(selectedDate, 'M/d')}
                </Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity
              onPress={async () => {
                router.push('/(tabs)/today/workout-session')
                await startWorkout(['Barbell Bench Press'], true);
              }}
              style={styles.actionButtonPrimary}
            >
              <Text style={styles.actionButtonText}>Start Workout</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.actionRow}>
            <TouchableOpacity
              onPress={cancelWorkout}
              style={styles.actionButtonCancel}
            >
              <Text style={styles.actionButtonText}>Cancel Workout</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => router.push('/(tabs)/today/workout-session')}
              style={styles.actionButtonPrimary}
            >
              <Text style={styles.actionButtonText}>Resume Workout</Text>
            </TouchableOpacity>
          </View>
        )}
        
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: 50,
    paddingHorizontal: 20,
    backgroundColor: '#000',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    marginVertical: 20,
  },
  summaryContainer: {
    flex: 1,
    gap: 16,
    paddingHorizontal: 20,
    // paddingTop: 12,
  },
  summaryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  summaryCard: {
    backgroundColor: '#222',
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
  },
  summaryHex: {
    backgroundColor: '#1a1a1a',
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
  },
  actionRow: {
    marginTop: 'auto',
    flexDirection: 'row',
    gap: 12,
  },
  actionButtonPrimary: {
    flex: 1,
    backgroundColor: '#6a5acd',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  actionButtonSecondary: {
    flex: 1,
    backgroundColor: '#444',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  actionButtonCancel: {
    flex: 1,
    backgroundColor: '#dd6b6b',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  actionButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  summaryLabel: {
    color: '#aaa',
  },
});