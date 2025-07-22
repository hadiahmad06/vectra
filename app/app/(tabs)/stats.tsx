import React, { useState } from 'react';
import { StyleSheet, Dimensions } from 'react-native';
const screenWidth = Dimensions.get('window').width;
const itemWidth = screenWidth * 0.44;

import { Text, View } from '@/components/Themed';
import GridPreview from '@/components/stats/preview/GridPreview';
import LineChartPreview from '@/components/stats/preview/LineChartPreview';
import { useHistory } from '@/contexts/HistoryContext';
import { useWorkoutStats } from '@/hooks/useWorkoutStats';
import Toggle from '@/components/common/Toggle';

export default function StatsScreen() {
  const [rangeToggle, setRangeToggle] = useState<'6M' | '6W' | '7D'>('6W');
  const [averageBy, setAverageBy] = useState<'day' | 'week' | 'month'>('day');
  const [startDate, setStartDate] = useState(new Date(Date.now() - 6 * 7 * 24 * 60 * 60 * 1000)); // 6 weeks ago
  const [endDate, setEndDate] = useState(new Date());

  const { avgWorkouts, avgSets, avgExercises, avgDuration } = useWorkoutStats(startDate, endDate, 'week', averageBy);

  const rangeStr =
    rangeToggle === '6M'
      ? 'Last 6 Months'
      : rangeToggle === '6W'
      ? 'Last 6 Weeks'
      : 'Last 7 Days';

  const averagedByStr =
    averageBy === 'month'
      ? 'this past month'
      : averageBy === 'week'
      ? 'this past week'
      : 'since yesterday';

  const lastAvgSet = avgSets.length > 0 ? Math.round(avgSets[avgSets.length - 1]) : null;
  const lastAvgExercise = avgExercises.length > 0 ? Math.round(avgExercises[avgExercises.length - 1]) : null;
  const lastAvgDuration = avgDuration.length > 0 ? Math.round(avgDuration[avgDuration.length - 1]) : null;

  return (
    <View style={styles.container}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
        <Text style={styles.title}>Your Stats</Text>
        <Toggle
          options={[
            { key: '6M', label: '6M' },
            { key: '6W', label: '6W' },
            { key: '7D', label: '7D' },
          ]}
          selected={rangeToggle}
          onChange={(val) => setRangeToggle(val as '6M' | '6W' | '7D')}
          width={50}
        />
      </View>
      <Text style={styles.section}>Recent Progress</Text>
      <View style={styles.gridContainer}>
        <View style={styles.gridItem}>
          <GridPreview
            title="Sets Over Time"
            caption={rangeStr}
            footerValue={lastAvgSet !== null ? `${lastAvgSet}` : '—'}
            footerUnit={`set${lastAvgSet !== 1 ? 's' : ''} ${averagedByStr}`}
          >
            <LineChartPreview color={'#6495ED'} data={avgSets}/>
          </GridPreview>
        </View>
        <View style={styles.gridItem}>
          <GridPreview
            title="Duration Over Time"
            caption={rangeStr}
            footerValue={
              lastAvgDuration !== null
                ? (() => {
                    const hours = Math.floor(lastAvgDuration / 60);
                    const minutes = Math.round(lastAvgDuration % 60);
                    return `${hours > 0 ? `${hours} hr${hours !== 1 ? 's' : ''}` : ''}${minutes > 0 ? ` ${minutes} min` : hours === 0 ? '0 min' : ''}`;
                  })()
                : 'N/A'
            }
            footerUnit={averagedByStr}
          >
            <LineChartPreview color={'#90EE90'} data={avgSets}/>
          </GridPreview>
        </View>
        <View style={styles.gridItem}>
          <GridPreview
            title="Exercise Variance"
            caption={rangeStr}
            footerValue={lastAvgExercise !== null ? `${lastAvgExercise}` : '—'}
            footerUnit={`exercises ${averagedByStr}`}
          >
            <LineChartPreview color={'#FFB347'} data={avgExercises}/>
          </GridPreview>
        </View>
      </View>
      <Text style={styles.section}>Habits</Text>
      <View style={styles.gridContainer}></View>

      <Text style={styles.section}>Body Metrics</Text>
      <View style={styles.gridContainer}></View>

      <Text style={styles.section}>Muscle Breakdown</Text>
      <View style={styles.gridContainer}></View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60,
    paddingHorizontal: 20,
    backgroundColor: '#000',
  },
  title: {
    fontSize: 26,
    fontWeight: '800',
    color: '#fff',
    marginTop: 8,
    marginBottom: 8,
  },
  section: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
    marginTop: 16,
    marginBottom: 8,
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    rowGap: 12,
  },
  gridItem: {
    width: itemWidth,
    marginBottom: 12,
  },
});
