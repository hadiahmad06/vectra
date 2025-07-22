import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { MotiView } from 'moti';
import { useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';


export type ToggleOption = {
  key: string;
  label: string;
  disabled?: boolean;
};

type ToggleProps = {
  options: ToggleOption[];
  selected: string;
  onChange: (val: string) => void;
  width?: number;
  backgroundColor?: string,
};

// i used a padding of 4, dont change these values without updating the width calculation
export default function Toggle({ options, selected, onChange, width = 70, backgroundColor = '#6a5acd' }: ToggleProps) {
  // console.log('selected', selected, 'keys:', options.map((opt) => opt.key));
  const length = options.length;
  
  function indexOfKey(key: string): number {
    return options.findIndex((opt) => opt.key === key)
  };
  const selectedIndex = indexOfKey(selected);
  const translateX = useSharedValue(selectedIndex * (width + 4 + 4/length));

  useEffect(() => {
    translateX.value = withTiming(selectedIndex * (width + 4 + 4/length));
  }, [selected]);

  const animateShake = (key: string) => {
    const base = selectedIndex * (width + 4 + 4/length);
    translateX.value = withTiming(base);
    const offset = indexOfKey(key) > selectedIndex ? 10 : -10;
    setTimeout(() => {
      translateX.value = withTiming(base + offset);
      setTimeout(() => {
        translateX.value = withTiming(base);
      }, 150);
    }, 0);
  };

  const sliderStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  const handlePress = (key: string, disabled?: boolean) => {
    if (disabled) {
      animateShake(key);
    } else {
      onChange(key);
    }
  };

  return (
    <View style={styles.toggleWrapper}>
      <View style={styles.toggleInner}>
        <MotiView
          style={[styles.toggleSlider, sliderStyle, { width: width + 4 + 4/length, backgroundColor }]}
          transition={{ type: 'timing', duration: 200 }}
        />
        {options.map((val) => (
          <TouchableOpacity key={val.key} onPress={() => handlePress(val.key, val.disabled)}>
            <View style={[styles.toggleOption, { width }]}>
              <Text style={styles.toggleText}>{val.label}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  toggleWrapper: {
    // gap: 4,
    flexDirection: 'row',
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 8,
    paddingHorizontal: 4,
    paddingVertical: 2,
    position: 'relative',
    overflow: 'hidden',
  },
  toggleInner: {
    flexDirection: 'row',
    position: 'relative',
    paddingHorizontal: 4,
    gap: 4,
    paddingVertical: 2,
    backgroundColor: 'transparent',
  },
  toggleSlider: {
    flex: 1,
    position: 'absolute',
    top: 2,
    height: '100%',
    borderRadius: 6,
  },
  toggleOption: {
    backgroundColor: 'transparent',
    paddingVertical: 4,
    paddingHorizontal: 3,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  toggleText: {
    color: '#fff',
  },
});