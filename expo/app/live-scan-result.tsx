import { Text } from '@/components/ui/text';
import { Icon } from '@/components/ui/icon';
import { ArrowLeftIcon, PackageIcon, ClockIcon } from 'lucide-react-native';
import * as React from 'react';
import {
  View,
  Pressable,
  ScrollView,
  Image,
  Dimensions,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { getObjectConfig } from '@/lib/object-priorities';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface Detection {
  name: string;
  confidence: number;
  bbox: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
}

export default function LiveScanResultScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();

  // Parse the detection results from params
  const detections: Detection[] = params.detections 
    ? JSON.parse(params.detections as string) 
    : [];
  const imageBase64 = params.image as string;
  const inferenceTime = parseFloat(params.inferenceTime as string) || 0;

  return (
    <View className="flex-1 bg-black">
      {/* Header */}
      <View className="pt-12 pb-4 px-5 border-b border-white/10">
        <Pressable 
          onPress={() => router.back()}
          className="flex-row items-center gap-2 mb-4"
        >
          <Icon as={ArrowLeftIcon} size={24} color="#ffffff" />
          <Text className="text-white text-lg font-semibold">Back to Live Scan</Text>
        </Pressable>
        
        <View>
          <Text className="text-white text-2xl font-bold">Detection Result</Text>
          <Text className="text-white/60 text-sm mt-1">
            {new Date().toLocaleString('en-US', {
              month: 'short',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            })}
          </Text>
        </View>
      </View>

      <ScrollView 
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 20 }}
      >
        <View className="p-6">
          {/* Stats */}
          <View className="flex-row gap-4 mb-6">
            <View className="flex-1 bg-white/10 p-4 rounded-xl border border-white/20">
              <View className="flex-row items-center gap-2 mb-2">
                <Icon as={PackageIcon} size={16} color="#ffffff" />
                <Text className="text-white/70 text-xs font-medium">Objects Found</Text>
              </View>
              <Text className="text-white text-3xl font-bold">{detections.length}</Text>
            </View>
            <View className="flex-1 bg-white/10 p-4 rounded-xl border border-white/20">
              <View className="flex-row items-center gap-2 mb-2">
                <Icon as={ClockIcon} size={16} color="#ffffff" />
                <Text className="text-white/70 text-xs font-medium">Inference Time</Text>
              </View>
              <Text className="text-white text-3xl font-bold">
                {inferenceTime.toFixed(0)}
                <Text className="text-lg">ms</Text>
              </Text>
            </View>
          </View>

          {/* Image with Bounding Boxes */}
          {imageBase64 && (
            <View className="mb-6">
              <Text className="text-white text-lg font-semibold mb-3">
                Detected Objects
              </Text>
              <View 
                className="bg-white/5 rounded-xl overflow-hidden border border-white/20"
                style={{ aspectRatio: 1 }}
              >
                <Image
                  source={{ uri: `data:image/jpeg;base64,${imageBase64}` }}
                  style={{ width: '100%', height: '100%' }}
                  resizeMode="cover"
                />
                {/* Render bounding boxes */}
                {detections.map((detection, index) => {
                  const config = getObjectConfig(detection.name || 'Unknown');
                  const imageSize = SCREEN_WIDTH - 48;
                  
                  const boxLeft = detection.bbox.x * imageSize;
                  const boxTop = detection.bbox.y * imageSize;
                  const boxWidth = detection.bbox.width * imageSize;
                  const boxHeight = detection.bbox.height * imageSize;

                  return (
                    <View
                      key={`box-${index}`}
                      style={{
                        position: 'absolute',
                        left: boxLeft,
                        top: boxTop,
                        width: boxWidth,
                        height: boxHeight,
                        borderWidth: 3,
                        borderColor: config.color,
                        borderRadius: 8,
                        backgroundColor: `${config.color}15`,
                      }}
                    >
                      <View
                        style={{
                          position: 'absolute',
                          top: -28,
                          left: 0,
                          backgroundColor: config.color,
                          paddingHorizontal: 8,
                          paddingVertical: 4,
                          borderRadius: 4,
                        }}
                      >
                        <Text className="text-white text-xs font-bold">
                          {config.displayName} {(detection.confidence * 100).toFixed(0)}%
                        </Text>
                      </View>
                    </View>
                  );
                })}
              </View>
            </View>
          )}

          {/* Detections List */}
          {detections.length > 0 ? (
            <View>
              <Text className="text-white text-lg font-semibold mb-3">
                Object Details ({detections.length})
              </Text>
              {detections.map((detection, index) => {
                const config = getObjectConfig(detection.name || 'Unknown');
                
                return (
                  <View
                    key={`detection-${index}`}
                    className="bg-white/5 p-4 rounded-xl mb-3"
                    style={{ borderWidth: 2, borderColor: config.color }}
                  >
                    <View className="flex-row items-center justify-between">
                      <View className="flex-1">
                        <Text className="text-white text-lg font-semibold">
                          {config.displayName || detection.name}
                        </Text>
                      </View>
                      <View className="bg-white px-3 py-1 rounded-full">
                        <Text className="text-black text-sm font-bold">
                          {(detection.confidence * 100).toFixed(1)}%
                        </Text>
                      </View>
                    </View>
                  </View>
                );
              })}
            </View>
          ) : (
            <View className="bg-white/5 p-6 rounded-xl border border-white/20 items-center">
              <Text className="text-white/60 text-center text-base">
                No objects were detected
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
}
