import { Text } from '@/components/ui/text';
import { View } from 'react-native';

interface DashboardHeaderProps {
  title: string;
  description: string;
}

export function DashboardHeader({ title, description }: DashboardHeaderProps) {
  return (
    <View className="px-6 pt-6 pb-4">
      <Text className="text-base text-zinc-500 dark:text-zinc-500 leading-relaxed">
        {title}
      </Text>
      <Text className="text-base text-zinc-500 dark:text-zinc-500 leading-relaxed">
        {description}
      </Text>
    </View>
  );
}
