import { Text } from '@/components/ui/text';
import * as React from 'react';
import { View, Dimensions } from 'react-native';
import { BarChart } from 'react-native-chart-kit';

interface ObjectChartProps {
  data: { name: string; count: number }[];
}

const SCREEN_WIDTH = Dimensions.get('window').width;

export function ObjectChart({ data }: ObjectChartProps) {
  if (data.length === 0) {
    return (
      <View className="bg-white/5 p-6 rounded-xl border border-white/20">
        <Text className="text-white/60 text-center">No data available</Text>
      </View>
    );
  }

  const chartData = {
    labels: data.slice(0, 5).map((item) => {
      // Truncate long names
      return item.name.length > 10 ? item.name.substring(0, 10) + '...' : item.name;
    }),
    datasets: [
      {
        data: data.slice(0, 5).map((item) => item.count),
        colors: data.slice(0, 5).map((_, index) => {
          const colors = [
            () => '#3b82f6', // blue
            () => '#10b981', // green
            () => '#f59e0b', // amber
            () => '#ef4444', // red
            () => '#8b5cf6', // purple
          ];
          return colors[index] || (() => '#6b7280');
        }),
      },
    ],
  };

  return (
    <View className="bg-white/5 rounded-xl border border-white/20 p-4">
      <Text className="text-white text-lg font-semibold mb-4">Object Distribution</Text>
      <BarChart
        data={chartData}
        width={SCREEN_WIDTH - 64}
        height={220}
        yAxisLabel=""
        yAxisSuffix=""
        chartConfig={{
          backgroundColor: '#000000',
          backgroundGradientFrom: '#000000',
          backgroundGradientTo: '#1a1a1a',
          decimalPlaces: 0,
          color: (opacity = 1) => `rgba(59, 130, 246, ${opacity})`,
          labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity * 0.7})`,
          style: {
            borderRadius: 16,
          },
          propsForBackgroundLines: {
            strokeDasharray: '',
            stroke: 'rgba(255, 255, 255, 0.1)',
          },
          propsForLabels: {
            fontSize: 10,
          },
        }}
        style={{
          marginVertical: 8,
          borderRadius: 16,
        }}
        showValuesOnTopOfBars
        fromZero
        withCustomBarColorFromData
        flatColor
      />
    </View>
  );
}
