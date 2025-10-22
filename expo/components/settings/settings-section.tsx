import { Text } from '@/components/ui/text';
import { View } from 'react-native';

interface SettingsSectionProps {
  title: string;
  children: React.ReactNode;
}

export function SettingsSection({ title, children }: SettingsSectionProps) {
  return (
    <View className="mb-8">
      <Text className="text-xs font-semibold text-zinc-600 dark:text-zinc-600 uppercase tracking-wider px-6 mb-4">
        {title}
      </Text>
      {children}
    </View>
  );
}
