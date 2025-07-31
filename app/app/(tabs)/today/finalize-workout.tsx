import React, { useState } from 'react';
import { Text, TextInput, View, ScrollView, useColorScheme, TouchableOpacity, StyleSheet } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';

// ...other components like WorkoutSession

export default function FinalizeWorkoutPage() {
  const [duration, setDuration] = useState<number | null>(null);
  const [date, setDate] = useState(new Date());
  const [notes, setNotes] = useState('');
  const [durationHours, setDurationHours] = useState(0);
  const [durationMinutes, setDurationMinutes] = useState(0);
  const colorScheme = useColorScheme();
  const isDark = true;

  const styles = getStyles(isDark);

  return (
    <ScrollView
      contentContainerStyle={[
        styles.container,
        { backgroundColor: isDark ? '#000' : '#fff' }
      ]}
    >
      <Text
        style={[
          styles.sectionLabel,
          { color: isDark ? '#fff' : '#000' }
        ]}
      >
        Start Date / Time:
      </Text>
      <View style={styles.card}>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
          <DateTimePicker
            value={date}
            mode="date"
            display="inline"
            onChange={(event, selectedDate) => {
              // if (selectedDate) setDate(selectedDate);
            }}
            style={{ width: '100%' }}
          />
        </View>
        <View style={styles.rowWithPadding}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 0}}>
            <Text
              numberOfLines={1}
              adjustsFontSizeToFit={true}
              style={{
                color: isDark ? '#fff' : '#000',
                fontWeight: '700',
                fontSize: 16,
                flexShrink: 1,
                // width: '25%'
              }}
            >
              Start Time:
            </Text>
            <DateTimePicker
              value={date}
              mode="time"
              display="default"
              onChange={(event, selectedDate) => {
                if (selectedDate) setDate(selectedDate);
              }}
              // style={{ width: '25%' }}
            />
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 0 }}>
            <Text
              numberOfLines={1}
              adjustsFontSizeToFit={true}
              style={{
                color: isDark ? '#fff' : '#000',
                fontWeight: '700',
                fontSize: 16,
                flexShrink: 1,
                // width: '25%'
              }}
            >
              Duration:
            </Text>
            <DateTimePicker
              value={date}
              mode="time"
              display="default"
              locale='en_GB'
              onChange={(event, selectedDate) => {
                if (selectedDate) {
                  const hours = selectedDate.getHours();
                  const minutes = selectedDate.getMinutes();
                  setDurationHours(hours);
                  setDurationMinutes(minutes);
                  setDuration(hours * 60 + minutes);
                }
              }}
              // style={{ width: '25%' }}
            />
          </View>
        </View>
      </View>

      <Text
        style={[
          styles.sectionLabel,
          { color: isDark ? '#fff' : '#000', marginTop: 24 }
        ]}
      >
        Notes:
      </Text>
      <TextInput
        multiline
        placeholder="Optional notes..."
        value={notes}
        onChangeText={setNotes}
        placeholderTextColor={isDark ? '#aaa' : '#888'}
        style={[
          styles.textInput,
          {
            backgroundColor: isDark ? '#222' : '#fff',
            color: isDark ? '#fff' : '#000',
          }
        ]}
      />
    </ScrollView>
  );
}

const getStyles = (isDark: boolean) => StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 24,
    paddingTop: 24,
  },
  sectionLabel: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 10,
  },
  card: {
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
    padding: 12,
    marginBottom: 24,
    backgroundColor: isDark ? '#111' : '#f1f3f7',
    flexDirection: 'column',
    width: '100%',
    gap: 8,
  },
  pickerBox: {
    flex: 1,
    overflow: 'hidden',
  },
  textInput: {
    borderRadius: 8,
    padding: 10,
    height: 100,
    textAlignVertical: 'top',
    marginBottom: 32,
    fontSize: 16,
  },
  rowWithPadding: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
    // paddingHorizontal: 230,
    marginBottom: 8,
    width: '100%',
  },
});