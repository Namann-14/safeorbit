import { Text } from '@/components/ui/text';
import { Pressable, View } from 'react-native';
import * as React from 'react';

interface SettingsToggleProps {
  title: string;
  subtitle?: string;
  value: boolean;
  onValueChange: (value: boolean) => void;
}

export function SettingsToggle({ 
  title, 
  subtitle, 
  value, 
  onValueChange 
}: SettingsToggleProps) {
  const handleToggle = () => {
    onValueChange(!value);
  };

  return (
    <Pressable 
      onPress={handleToggle}
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
      
      {/* Custom Toggle Switch */}
      <Pressable 
        onPress={handleToggle}
        className={`w-12 h-7 rounded-full p-0.5 ${
          value 
            ? 'bg-white dark:bg-white' 
            : 'bg-zinc-700 dark:bg-zinc-700'
        }`}
      >
        <View 
          className={`w-6 h-6 rounded-full ${
            value 
              ? 'bg-black dark:bg-black translate-x-5' 
              : 'bg-zinc-500 dark:bg-zinc-500 translate-x-0'
          }`}
          style={{
            transform: [{ translateX: value ? 20 : 0 }],
          }}
        />
      </Pressable>
    </Pressable>
  );
}
