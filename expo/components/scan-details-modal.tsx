import { Text } from '@/components/ui/text';
import { Icon } from '@/components/ui/icon';
import { XIcon, ClockIcon, PackageIcon } from 'lucide-react-native';
import * as React from 'react';
import {
  View,
  Modal,
  Pressable,
  ScrollView,
  Dimensions,
} from 'react-native';
import { ScanResult } from '@/lib/storage';

interface ScanDetailsModalProps {
  visible: boolean;
  scan: ScanResult | null;
  onClose: () => void;
}

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

export function ScanDetailsModal({ visible, scan, onClose }: ScanDetailsModalProps) {
  if (!scan) return null;

  console.log('Modal rendering with scan:', {
    id: scan.id,
    totalObjects: scan.totalObjects,
    detectionsLength: scan.detections?.length || 0,
    detectionsExists: !!scan.detections,
    detections: scan.detections,
  });

  const detections = scan.detections || [];
  const totalObjects = scan.totalObjects || detections.length;
  const inferenceTime = scan.inferenceTime || 0;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View className="flex-1 bg-black/80 justify-end">
        <Pressable 
          className="flex-1" 
          onPress={onClose}
        />
        
        <View 
          className="bg-black border-t-2 border-white/20 rounded-t-3xl"
          style={{ maxHeight: SCREEN_HEIGHT * 0.85 }}
        >
          {/* Header */}
          <View className="flex-row items-center justify-between p-6 border-b border-white/10">
            <View>
              <Text className="text-white text-2xl font-bold">Scan Details</Text>
              <Text className="text-white/60 text-sm mt-1">{scan.dateTime}</Text>
            </View>
            <Pressable
              onPress={onClose}
              className="w-10 h-10 rounded-full bg-white/10 items-center justify-center"
            >
              <Icon as={XIcon} size={24} color="#ffffff" />
            </Pressable>
          </View>

          <ScrollView 
            className="flex-1"
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 20 }}
          >
            <View className="p-6">
              {/* Debug Info - Remove after testing */}
              <View className="bg-white/5 p-3 rounded-lg mb-4 border border-white/20">
                <Text className="text-white/60 text-xs">
                  Debug: {detections.length} detections loaded
                </Text>
              </View>

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

              {/* Detections List */}
              {detections.length > 0 ? (
                <View>
                  <Text className="text-white text-lg font-semibold mb-3">
                    Detected Objects ({detections.length})
                  </Text>
                  {detections.map((detection, index) => (
                    <View
                      key={`detection-${index}`}
                      className="bg-white/5 p-4 rounded-xl mb-3 border border-white/20"
                    >
                      <View className="flex-row items-center justify-between mb-2">
                        <Text className="text-white text-lg font-semibold">
                          {detection.name || 'Unknown'}
                        </Text>
                        <View className="bg-white px-3 py-1 rounded-full">
                          <Text className="text-black text-sm font-bold">
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
                    </View>
                  ))}
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
      </View>
    </Modal>
  );
}
