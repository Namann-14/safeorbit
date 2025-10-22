import { Text } from '@/components/ui/text';
import * as React from 'react';
import { View, Dimensions } from 'react-native';
import { PieChart } from 'react-native-chart-kit';

interface CylinderPieChartProps {
  data: { name: string; count: number; percentage: number }[];
}

const SCREEN_WIDTH = Dimensions.get('window').width;

const COLORS = [
  '#3b82f6', // blue
  '#10b981', // green
  '#f59e0b', // amber
  '#ef4444', // red
  '#8b5cf6', // purple
  '#ec4899', // pink
  '#14b8a6', // teal
];

export function CylinderPieChart({ data }: CylinderPieChartProps) {
  if (data.length === 0) {
    return (
      <View className="bg-white/5 p-6 rounded-xl border border-white/20">
        <Text className="text-white/60 text-center">No cylinder data available</Text>
      </View>
    );
  }

  const chartData = data.slice(0, 5).map((item, index) => ({
    name: item.name,
    population: item.count,
    color: COLORS[index % COLORS.length],
    legendFontColor: '#ffffff',
    legendFontSize: 12,
  }));

  return (
    <View className="bg-white/5 rounded-xl border border-white/20 p-4">
      <Text className="text-white text-lg font-semibold mb-4">Cylinder Type Distribution</Text>
      <PieChart
        data={chartData}
        width={SCREEN_WIDTH - 64}
        height={220}
        chartConfig={{
          color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
          labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
        }}
        accessor="population"
        backgroundColor="transparent"
        paddingLeft="15"
        center={[10, 0]}
        absolute
      />
      
      {/* Legend with percentages */}
      <View className="mt-4 space-y-2">
        {data.slice(0, 5).map((item, index) => (
          <View key={index} className="flex-row items-center justify-between mb-2 py-2 px-3 bg-white/5 rounded-lg">
            <View className="flex-row items-center gap-3 flex-1">
              <View 
                style={{ 
                  width: 16, 
                  height: 16, 
                  borderRadius: 8, 
                  backgroundColor: COLORS[index % COLORS.length] 
                }} 
              />
              <Text className="text-white text-sm font-medium flex-1">{item.name}</Text>
            </View>
            <Text className="text-white font-bold text-sm">
              {item.count} <Text className="text-white/60 text-xs">({item.percentage.toFixed(1)}%)</Text>
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
}
