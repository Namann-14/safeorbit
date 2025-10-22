import { Card } from '@/components/ui/card';
import { Text } from '@/components/ui/text';
import { View } from 'react-native';

interface ComparisonCardProps {
  title: string;
  description: string;
  detected: number;
  missing: number;
  trend?: string;
  trendPositive?: boolean;
}

export function ComparisonCard({ 
  title, 
  description, 
  detected, 
  missing, 
  trend,
  trendPositive 
}: ComparisonCardProps) {
  const total = detected + missing;
  const percentage = total > 0 ? (detected / total) * 100 : 0;

  return (
    <Card className="rounded-2xl border border-zinc-800 bg-zinc-900 dark:bg-zinc-900 p-6 mb-4">
      <Text className="text-base font-medium text-zinc-400 dark:text-zinc-400">
        {title}
      </Text>
      <Text className="text-sm text-zinc-500 dark:text-zinc-500 mt-1">
        {description}
      </Text>
      
      <View className="flex-row items-baseline mt-4">
        <Text className="text-4xl font-bold text-white dark:text-white">
          {detected.toLocaleString()}
        </Text>
        <Text className="text-4xl font-bold text-white dark:text-white mx-2">
          /
        </Text>
        <Text className="text-4xl font-bold text-white dark:text-white">
          {missing}
        </Text>
        {trend && (
          <Text 
            className={`text-base ml-3 ${
              trendPositive 
                ? 'text-green-500 dark:text-green-500' 
                : 'text-red-500 dark:text-red-500'
            }`}
          >
            {trend}
          </Text>
        )}
      </View>

      {/* Progress Bar */}
      <View className="mt-4 h-2 w-full bg-zinc-800 dark:bg-zinc-800 rounded-full overflow-hidden">
        <View 
          className="h-full bg-white dark:bg-white rounded-full" 
          style={{ width: `${percentage}%` }}
        />
      </View>
    </Card>
  );
}
