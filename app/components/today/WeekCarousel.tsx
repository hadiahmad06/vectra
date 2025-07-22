import { FontAwesome } from "@expo/vector-icons";
import { View } from "../Themed";
import { MotiView } from "moti";
import { StyleSheet, Text, TouchableOpacity } from "react-native";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { Easing } from "react-native-reanimated";

interface WeekCarouselProps {
  startOfWeek: Date;
  setStartOfWeek: Dispatch<SetStateAction<Date>>;
  selectedDateOffset: number;
  setSelectedDateOffset: Dispatch<SetStateAction<number>>;
  fetchWorkoutsInRange: () => Promise<{
    date: string;
    id: string;
    duration: number;
    created_at: string;
    updated_at: string;
    setsCount: number;
    exercisesCount: number;
    muscleDistribution: Record<string, number>;
    title?: string | undefined;
    notes?: string | undefined;
  }[]>
}

export function WeekCarousel({
  startOfWeek,
  setStartOfWeek,
  selectedDateOffset,
  setSelectedDateOffset,
  fetchWorkoutsInRange
}: WeekCarouselProps) {

  const [weekAnimationDirection, setWeekAnimationDirection] = useState<'left' | 'right' | null>(null);
  const [weekStatuses, setWeekStatuses] = useState<boolean[]>([]);
  
  const [bubbleWidth, setBubbleWidth] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    setIsAnimating(true);

    const shrinkTimeout = setTimeout(() => {
      setIsAnimating(false);
    }, 200); // adjust this value as needed

    return () => clearTimeout(shrinkTimeout);
  }, [selectedDateOffset]);

  useEffect(() => {
    fetchWorkoutsInRange().then((res) => {
      const statuses = Array.from({ length: 7 }, (_, i) => {
        const day = new Date(startOfWeek);
        day.setDate(startOfWeek.getDate() + i);
        return res.some((w) => new Date(w.date).toDateString() === day.toDateString());
      });
      setWeekStatuses(statuses);
    });
  }, [startOfWeek])

  return (
    <View style={styles.weekNav}>
      <FontAwesome
        name="chevron-left"
        style={styles.arrow}
        onPress={() => {
          setWeekAnimationDirection('left');
          setStartOfWeek(prev => {
            const newDate = new Date(prev);
            newDate.setDate(prev.getDate() - 7);
            return newDate;
          });
        }}
      />
      <View style={styles.weekContainerWrapper}>
        <MotiView
          key={startOfWeek.toISOString()}
          from={{
            translateX: weekAnimationDirection === 'left' ? -100 : 100,
            opacity: 0,
          }}
          animate={{
            translateX: 0,
            opacity: 1,
          }}
          transition={{
            type: 'timing',
            duration: 300,
          }}
          style={styles.weekContainer}
          onDidAnimate={() => setWeekAnimationDirection(null)}
        >
          {Array.from({ length: 7 }).map((_, index) => {
            const date = new Date(startOfWeek);
            date.setDate(date.getDate() + index);
            const dayName = date.getDate().toString();

            return (
              <TouchableOpacity
                key={index}
                activeOpacity={0.7}
                onPress={() => setSelectedDateOffset(index)}
                style={[
                  styles.dateBubble,
                  weekStatuses[index] && styles.activeDateBubble,
                  { position: 'relative' },
                ]}
              >
                <Text
                  numberOfLines={1}
                  adjustsFontSizeToFit
                  style={[
                    styles.dateText,
                    weekStatuses[index] && styles.activeDateText,
                  ]}
                >
                  {dayName}
                </Text>
              </TouchableOpacity>
            );
          })}
        </MotiView>
        <View
          style={{
            position: 'absolute',
            height: 14,
            width: '100%',
            top: '100%'
          }}
          onLayout={(event) => {
            const totalWidth = event.nativeEvent.layout.width;
            const gap = 4;
            const usableWidth = totalWidth - gap * 6;
            const calcBubbleWidth = usableWidth / 7;
            setBubbleWidth(calcBubbleWidth);
          }}
        >
          <MotiView
            from={{ translateX: 0 }}
            // IF WEEK CONTAINER GAP IS CHANGED THIS WILL BREAK
            animate={{ translateX: (bubbleWidth + 4) * selectedDateOffset }}
            transition={{
              type: 'timing',
              duration: 400,
              easing: Easing.out(Easing.ease),
            }}
            style={{
              position: 'relative',
              width: bubbleWidth,
              height: 6,
              top: 6,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <MotiView
              from={{ scaleX: 0.75 }}
              animate={{ scaleX: isAnimating ? 3 : 0.75 }}
              transition={{ type: 'timing', duration: 200 }}
              style={{
                position: 'relative',
                width: '20%',
                height: 6,
                borderRadius: 999,
                backgroundColor: '#ccc',
              }}
            />
          </MotiView>
        </View>
      </View>
      <FontAwesome
        name="chevron-right"
        style={styles.arrow}
        onPress={() => {
          setWeekAnimationDirection('right');
          setStartOfWeek(prev => {
            const newDate = new Date(prev);
            newDate.setDate(prev.getDate() + 7);
            return newDate;
          });
        }}
      />
    </View>
  )
}
const styles = StyleSheet.create({
  weekNav: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  weekContainerWrapper: {
    flex: 1,
    overflow: 'visible',
    position: 'relative',
  },
  weekContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  arrow: {
    alignSelf: 'center',
    paddingTop: 2,  
    color: '#fff',
    fontSize: 20,
    paddingHorizontal: 10,
  },
  dateBubble: {
    flex: 1,
    backgroundColor: '#222',
    borderRadius: 20,
    paddingVertical: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeDateBubble: {
    backgroundColor: '#6a5acd',
  },
  dateText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
    includeFontPadding: false,
    textAlignVertical: 'center',
  },
  activeDateText: {
    fontWeight: 'bold',
    color: '#fff',
  }
})