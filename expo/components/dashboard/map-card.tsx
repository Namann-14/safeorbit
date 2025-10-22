import { Card } from '@/components/ui/card';
import { Text } from '@/components/ui/text';
import { View, Image } from 'react-native';

interface MapCardProps {
  title: string;
  description: string;
  mapImageUri?: string;
}

export function MapCard({ title, description, mapImageUri }: MapCardProps) {
  return (
    <Card className="rounded-2xl border border-zinc-800 bg-zinc-900 dark:bg-zinc-900 p-6 mb-4">
      <Text className="text-base font-medium text-zinc-400 dark:text-zinc-400">
        {title}
      </Text>
      <Text className="text-sm text-zinc-500 dark:text-zinc-500 mt-1">
        {description}
      </Text>
      
      {/* Map Container */}
      <View className="mt-4 h-48 w-full bg-zinc-800 dark:bg-zinc-800 rounded-xl overflow-hidden">
        {mapImageUri ? (
          <Image 
            source={{ uri: mapImageUri }}
            className="w-full h-full"
            resizeMode="cover"
          />
        ) : (
          <View className="flex-1 items-center justify-center">
            <Text className="text-zinc-600 dark:text-zinc-600">
              Map View
            </Text>
          </View>
        )}
      </View>
    </Card>
  );
}
