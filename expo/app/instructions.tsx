import React from 'react';
import { View, ScrollView, Pressable } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { Text } from '../components/ui/text';
import { getObjectInstructions } from '../lib/object-instructions';
import { getObjectConfig } from '../lib/object-priorities';
import { Icon } from '../components/ui/icon';
import { ArrowLeft, AlertTriangle, Phone } from 'lucide-react-native';

export default function InstructionsScreen() {
  const { objectName } = useLocalSearchParams<{ objectName: string }>();
  
  const instructions = objectName ? getObjectInstructions(objectName) : null;
  const config = objectName ? getObjectConfig(objectName) : null;

  if (!instructions) {
    return (
      <View className="flex-1 bg-black">
        <View className="px-6 pt-16 pb-4 border-b border-white/10">
          <Pressable
            onPress={() => router.back()}
            className="flex-row items-center gap-2 mb-4"
          >
            <Icon as={ArrowLeft} size={24} className="text-white" />
            <Text className="text-white text-lg">Back</Text>
          </Pressable>
          <Text className="text-white text-2xl font-bold">Instructions Not Available</Text>
        </View>
        <View className="flex-1 items-center justify-center px-6">
          <Text className="text-white/60 text-center">
            No instructions are available for this object yet.
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-black">
      {/* Header */}
      <View className="px-6 pt-16 pb-4 border-b border-white/10">
        <Pressable
          onPress={() => router.back()}
          className="flex-row items-center gap-2 mb-4"
        >
          <Icon as={ArrowLeft} size={24} className="text-white" />
          <Text className="text-white text-lg">Back</Text>
        </Pressable>
        <View className="flex-row items-center gap-3">
          <View 
            style={{ backgroundColor: config?.color || '#ffffff' }}
            className="w-3 h-3 rounded-full"
          />
          <Text className="text-white text-2xl font-bold flex-1">
            How to Use: {instructions.displayName}
          </Text>
        </View>
      </View>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Overview */}
        <View className="px-6 py-6 border-b border-white/10">
          <Text className="text-white/60 text-base leading-6">
            {instructions.overview}
          </Text>
        </View>

        {/* Emergency Contact */}
        {instructions.emergencyContact && (
          <View className="mx-6 my-4 p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
            <View className="flex-row items-center gap-2 mb-2">
              <Icon as={Phone} size={20} className="text-red-500" />
              <Text className="text-red-500 font-bold text-base">Emergency Contact</Text>
            </View>
            <Text className="text-red-500 text-sm">{instructions.emergencyContact}</Text>
          </View>
        )}

        {/* Steps */}
        <View className="px-6 py-4">
          <Text className="text-white text-xl font-bold mb-4">Step-by-Step Instructions</Text>
          
          {instructions.steps.map((step) => (
            <View key={step.step} className="mb-6">
              <View className="flex-row items-start gap-3 mb-2">
                <View 
                  style={{ backgroundColor: config?.color || '#ffffff' }}
                  className="w-8 h-8 rounded-full items-center justify-center"
                >
                  <Text className="text-black font-bold text-base">{step.step}</Text>
                </View>
                <View className="flex-1">
                  <Text className="text-white text-lg font-semibold mb-2">
                    {step.title}
                  </Text>
                  <Text className="text-white/80 text-base leading-6">
                    {step.description}
                  </Text>
                  
                  {step.warning && (
                    <View className="mt-3 p-3 bg-amber-500/10 border border-amber-500/30 rounded-lg flex-row gap-2">
                      <Icon as={AlertTriangle} size={16} className="text-amber-500 mt-0.5" />
                      <Text className="text-amber-500 text-sm flex-1">{step.warning}</Text>
                    </View>
                  )}
                </View>
              </View>
            </View>
          ))}
        </View>

        {/* Warnings */}
        {instructions.warnings.length > 0 && (
          <View className="mx-6 mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
            <View className="flex-row items-center gap-2 mb-3">
              <Icon as={AlertTriangle} size={20} className="text-red-500" />
              <Text className="text-red-500 font-bold text-lg">Important Warnings</Text>
            </View>
            {instructions.warnings.map((warning, index) => (
              <View key={index} className="flex-row gap-2 mb-2">
                <Text className="text-red-500 text-base">•</Text>
                <Text className="text-red-500 text-base flex-1 leading-6">{warning}</Text>
              </View>
            ))}
          </View>
        )}

        {/* Bottom Spacing */}
        <View className="h-8" />
      </ScrollView>
    </View>
  );
}
