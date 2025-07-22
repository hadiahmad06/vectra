

import React, { useState } from 'react';
import { View } from 'react-native';
import { LineChart } from 'react-native-chart-kit';

export default function LineChartPreview({color, data}: {color: string, data: number[]}) {
  const [parentWidth, setParentWidth] = useState(0);
  // const [parentHeight, setParentHeight] = useState(0);

  const chartData = {
    labels: [],
    datasets: [
      {
        // data: [22, 35, 45, 40, 54, 60, 60, 10, 22, 22],
        data: data,
        color: () => color,
        strokeWidth: 2,
      },
    ],
  };

  const chartConfig = {
    backgroundGradientFrom: 'transparent',
    backgroundGradientTo: 'transparent',
    backgroundGradientFromOpacity: 0,
    backgroundGradientToOpacity: 0,
    color: () => color,
    strokeWidth: 2,
    propsForDots: {
      r: '0',
    },
    decimalPlaces: 0,
  };

  return (
    <View 
        style={{ width: '100%', height: '100%' }} 
        onLayout={e => {
          setParentWidth(e.nativeEvent.layout.width);
          // setParentHeight(e.nativeEvent.layout.height);
        }}
    >
      {parentWidth > 0 && (
        <LineChart
          data={chartData}
          // scale width by (dataset length / dataset length-1) to make up for the last point
          width={parentWidth * ( chartData.datasets[0].data.length / (chartData.datasets[0].data.length - 1))} 
          height={60} // MATCHES GridPreview content height, move to context later.
          withVerticalLabels={false}
          withHorizontalLabels={false}
          withDots={false}
          withInnerLines={false}
          fromZero={true}
          withOuterLines={false}
          chartConfig={chartConfig}
          // bezier
          style={{
            height: 80, 
            alignSelf: 'stretch',
            paddingRight: 0,
          }}
        />
      )}
    </View>
  );
}