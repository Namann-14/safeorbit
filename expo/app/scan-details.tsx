import { Text } from '@/components/ui/text';
import { Icon } from '@/components/ui/icon';
import { ArrowLeftIcon, ClockIcon, PackageIcon, BookOpenIcon } from 'lucide-react-native';
import * as React from 'react';
import {
  View,
  Pressable,
  ScrollView,
  Image,
  Dimensions,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { getScanHistory, ScanResult, getScanImage } from '@/lib/storage';
import { getObjectConfig, sortByPriority, getPriorityLabel } from '@/lib/object-priorities';
import { hasInstructions } from '@/lib/object-instructions';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function ScanDetailsScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const [scan, setScan] = React.useState<ScanResult | null>(null);
  const [imageBase64, setImageBase64] = React.useState<string | null>(null);
  const [isLoadingImage, setIsLoadingImage] = React.useState(false);

  React.useEffect(() => {
    loadScanDetails();
  }, [params.scanId]);

  const loadScanDetails = async () => {
    try {
      const scanId = params.scanId as string;
      const history = await getScanHistory();
      const foundScan = history.find((s) => s.id === scanId);
      
      if (foundScan) {
        console.log('Loaded scan details:', foundScan.id, 'hasImageKey:', !!foundScan.imageKey);
        setScan(foundScan);
        
        // Load image separately if available
        if (foundScan.imageKey) {
          setIsLoadingImage(true);
          const image = await getScanImage(foundScan.id);
          setImageBase64(image);
          setIsLoadingImage(false);
        }
      } else {
        console.error('Scan not found:', scanId);
      }
    } catch (error) {
      console.error('Failed to load scan details:', error);
      setIsLoadingImage(false);
    }
  };

  if (!scan) {
    return (
      <View className="flex-1 bg-black items-center justify-center">
        <Text className="text-white text-lg">Loading...</Text>
      </View>
    );
  }

  const detections = scan.detections || [];
  const totalObjects = scan.totalObjects || detections.length;
  const inferenceTime = scan.inferenceTime || 0;

  return (
    <View className="flex-1 bg-black">
      {/* Header with Back Button */}
      <View className="pt-12 pb-4 px-5 border-b border-white/10">
        <Pressable 
          onPress={() => router.back()}
          className="flex-row items-center gap-2 mb-4"
        >
          <Icon as={ArrowLeftIcon} size={24} color="#ffffff" />
          <Text className="text-white text-lg font-semibold">Back to Home</Text>
        </Pressable>
        
        <View>
          <Text className="text-white text-2xl font-bold">Scan Details</Text>
          <Text className="text-white/60 text-sm mt-1">{scan.dateTime}</Text>
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
              <Text className="text-white text-3xl font-bold">{totalObjects}</Text>
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
                Detection Result
              </Text>
              {isLoadingImage ? (
                <View 
                  className="bg-white/5 rounded-xl border border-white/20 items-center justify-center"
                  style={{ aspectRatio: 1 }}
                >
                  <Text className="text-white/60">Loading image...</Text>
                </View>
              ) : (
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
                  const imageSize = SCREEN_WIDTH - 48; // Account for padding
                  
                  // Map normalized coordinates to image size
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
                        backgroundColor: `${config.color}15`, // 15 is hex for ~8% opacity
                      }}
                    >
                      {/* Label */}
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
              )}
            </View>
          )}

          {/* Detections List */}
          {detections.length > 0 ? (
            <View>
              <Text className="text-white text-lg font-semibold mb-3">
                Detected Objects ({detections.length})
              </Text>
              {sortByPriority(detections).map((detection, index) => {
                const config = getObjectConfig(detection.name || 'Unknown');
                const priorityLabel = getPriorityLabel(config.priority);
                const hasGuide = hasInstructions(detection.name || '');
                
                return (
                  <View
                    key={`detection-${index}`}
                    className="bg-white/5 p-4 rounded-xl mb-3"
                    style={{ borderWidth: 2, borderColor: config.color }}
                  >
                    <View className="flex-row items-center justify-between mb-2">
                      <View className="flex-1">
                        <View className="flex-row items-center gap-2 mb-1">
                          <View 
                            className="px-2 py-1 rounded"
                            style={{ backgroundColor: config.color }}
                          >
                            <Text className="text-white text-xs font-bold">
                              {priorityLabel}
                            </Text>
                          </View>
                        </View>
                        <Text className="text-white text-lg font-semibold">
                          {config.displayName || detection.name || 'Unknown'}
                        </Text>
                      </View>
                      <View 
                        className="px-3 py-1 rounded-full"
                        style={{ backgroundColor: config.color }}
                      >
                        <Text className="text-white text-sm font-bold">
                          {((detection.confidence || 0) * 100).toFixed(1)}%
                        </Text>
                      </View>
                    </View>
                    {detection.bbox && (
                      <View className="flex-row gap-4 mt-2">
                        <Text className="text-white/60 text-xs">
                          X: {((detection.bbox.x || 0) * 100).toFixed(1)}%
                        </Text>
                        <Text className="text-white/60 text-xs">
                          Y: {((detection.bbox.y || 0) * 100).toFixed(1)}%
                        </Text>
                        <Text className="text-white/60 text-xs">
                          W: {((detection.bbox.width || 0) * 100).toFixed(1)}%
                        </Text>
                        <Text className="text-white/60 text-xs">
                          H: {((detection.bbox.height || 0) * 100).toFixed(1)}%
                        </Text>
                      </View>
                    )}
                    
                    {/* Instructions Button */}
                    {hasGuide && (
                      <Pressable
                        onPress={() => router.push({
                          pathname: '/instructions',
                          params: { objectName: detection.name || '' }
                        })}
                        className="mt-3 flex-row items-center justify-center gap-2 py-2 px-4 rounded-lg"
                        style={{ backgroundColor: config.color }}
                      >
                        <Icon as={BookOpenIcon} size={16} color="#ffffff" />
                        <Text className="text-white text-sm font-bold">
                          How to Use
                        </Text>
                      </Pressable>
                    )}
                  </View>
                );
              })}
            </View>
          ) : (
            <View className="bg-white/5 p-6 rounded-xl border border-white/20 items-center">
              <Text className="text-white/60 text-center text-base">
                No objects were detected in this scan
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
}
