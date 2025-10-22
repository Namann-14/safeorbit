import { Card } from '@/components/ui/card';
import { Text } from '@/components/ui/text';
import { View } from 'react-native';

interface StatCardProps {
  title: string;
  description: string;
  value: string;
  trend?: string;
  trendPositive?: boolean;
}

export function StatCard({ title, description, value, trend, trendPositive }: StatCardProps) {
  return (
    <Card className="rounded-2xl border border-zinc-800 bg-zinc-900 dark:bg-zinc-900 p-6 mb-4">
      <Text className="text-base font-medium text-zinc-400 dark:text-zinc-400">
        {title}
      </Text>
      <Text className="text-sm text-zinc-500 dark:text-zinc-500">
        {description}
      </Text>
      <Text className="text-4xl font-bold text-white dark:text-white">
        {value}
      </Text>
      {trend && (
        <Text 
          className={`text-sm ${
            trendPositive 
              ? 'text-green-500 dark:text-green-500' 
              : 'text-red-500 dark:text-red-500'
          }`}
        >
          {trend}
        </Text>
      )}
    </Card>
  );
}
