import { useWorkout } from '@/contexts/WorkoutContext';
import { EnrichedExerciseSession } from '@/contexts/WorkoutProvider';
import React, { useEffect, useRef, useState, useMemo } from 'react';
import { StyleSheet, useColorScheme, Dimensions } from 'react-native';
import { KeyboardAvoidingView } from 'react-native-keyboard-controller';
import Carousel, { ICarouselInstance } from 'react-native-reanimated-carousel';
import { MotiView } from 'moti';
import AddExerciseCard from '@/components/workout/AddExerciseCard';
import ExerciseCard from '@/components/workout/ExerciseCard';

type ExerciseSlide = EnrichedExerciseSession | 'plus';

export default function WorkoutSession() {
  const { exercises } = useWorkout();
  const colorScheme = useColorScheme();
  const { width } = Dimensions.get('window');

  const [currentExerciseId, setCurrentExerciseId] = useState<string | null>(null);

  const slides: ExerciseSlide[] = useMemo(() => [...exercises, 'plus'], [exercises]);
  // const [currentIndex, setCurrentIndex] = useState<number>(0);
  const carouselRef = useRef<ICarouselInstance>(null);

  useEffect(() => {
    carouselRef.current?.scrollTo({index: slides.length-2});
  }, [])

  useEffect(() => {
    if (!currentExerciseId) return;
    const index = exercises.findIndex(ex => ex.id === currentExerciseId);
    if (index !== -1) {
      carouselRef.current?.scrollTo({ index });
    }
  }, [exercises]);

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={"padding"}
      keyboardVerticalOffset={75}
      // behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      // keyboardVerticalOffset={Platform.OS === 'ios' ? 80 : 0} // tweak as needed depending on nav/header
    >
    {/* <Animated.View style={{
      ...styles.container
    }}> */}
      <MotiView
        style={{...styles.container, height: '90%' }}
      >
        <Carousel
          loop
          ref={carouselRef}
          width={width}
          autoPlay={false}
          data={slides}
          scrollAnimationDuration={500}
          mode="parallax"
          onSnapToItem={(index) => {
            const item = slides[index];
            if (item !== 'plus') {
              setCurrentExerciseId(item.id);
            } else {
              setCurrentExerciseId(null);
            }
          }}
          modeConfig={{
            parallaxScrollingScale: 0.85,
            parallaxScrollingOffset: 80,
            parallaxAdjacentItemScale: 0.75,
          }}
          renderItem={({ item }) => {
            if (item === 'plus') {
              return (
                <AddExerciseCard/>
              );
            }
            return (
              <ExerciseCard exercise={item}/>
            );
          }}
        />
      </MotiView>
    {/* </Animated.View> */}
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    width: '100%'
  },
  cardBase: {
    flex: 1,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  text: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  subtext: {
    color: '#ccc',
    fontSize: 16,
    marginTop: 8,
    textAlign: 'center',
  },
  iconButton: {
    backgroundColor: '#888',
    borderRadius: 100,
    padding: 16,
    marginTop: 16,
  },
  recommendationLabel: {
    fontSize: 18,
    color: '#ccc',
    alignSelf: 'flex-start',
    marginBottom: 8,
  },
  recommendedList: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 24,
  },
  recommendedPill: {
    backgroundColor: '#555',
    color: '#fff',
    paddingVertical: 7,
    paddingHorizontal: 14,
    borderRadius: 999,
    fontSize: 20,
  },
  searchHintText: {
    color: '#ccc',
    fontSize: 18,
    flex: 1,
    padding: 0,
  },
  spacer: {
    flex: 1,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#555',
    // borderRadius: 16,      // ANIMATED
    paddingVertical: 10,
    paddingHorizontal: 12,
    // width: '100%',         // ANIMATED
  },
  searchIconContainer: {
    width: 40,
    height: 40,
    // borderRadius: 16,      // ANIMATED
    backgroundColor: '#888',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
});