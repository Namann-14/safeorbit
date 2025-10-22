import { Text } from '@/components/ui/text';
import { Icon } from '@/components/ui/icon';
import { ChevronRightIcon } from 'lucide-react-native';
import { Pressable, View } from 'react-native';

interface SettingsItemProps {
  title: string;
  subtitle?: string;
  value?: string;
  showArrow?: boolean;
  onPress?: () => void;
}

export function SettingsItem({ 
  title, 
  subtitle, 
  value, 
  showArrow = true,
  onPress 
}: SettingsItemProps) {
  return (
    <Pressable 
      onPress={onPress}
      className="flex-row items-center justify-between px-6 py-4 active:bg-zinc-900/50 dark:active:bg-zinc-900/50"
    >
      <View className="flex-1">
        <Text className="text-base font-medium text-white dark:text-white">
          {title}
        </Text>
        {subtitle && (
          <Text className="text-sm text-zinc-500 dark:text-zinc-500 mt-1">
            {subtitle}
          </Text>
        )}
      </View>
      
      <View className="flex-row items-center gap-2">
        {value && (
          <Text className="text-base text-zinc-500 dark:text-zinc-500">
            {value}
          </Text>
        )}
        {showArrow && (
          <Icon 
            as={ChevronRightIcon} 
            size={20} 
            className="text-zinc-500 dark:text-zinc-500" 
          />
        )}
      </View>
    </Pressable>
  );
}
