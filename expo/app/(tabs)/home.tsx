import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import { ShieldCheckIcon, ClockIcon, TrashIcon } from 'lucide-react-native';
import * as React from 'react';
import { Pressable, ScrollView, View, Alert, RefreshControl } from 'react-native';
import { useRouter } from 'expo-router';
import { getScanHistory, deleteScanResult, ScanResult } from '@/lib/storage';
import { useFocusEffect } from '@react-navigation/native';

export default function HomeScreen() {
  const router = useRouter();
  const [scanHistory, setScanHistory] = React.useState<ScanResult[]>([]);
  const [refreshing, setRefreshing] = React.useState(false);

  const loadScanHistory = async () => {
    try {
      const history = await getScanHistory();
      console.log('Loaded scan history:', history.length, 'scans');
      if (history.length > 0) {
        console.log('First scan sample:', JSON.stringify(history[0], null, 2));
      }
      setScanHistory(history);
    } catch (error) {
      console.error('Failed to load scan history:', error);
    }
  };

  // Load scan history when screen is focused
  useFocusEffect(
    React.useCallback(() => {
      loadScanHistory();
    }, [])
  );

  const onRefresh = async () => {
    setRefreshing(true);
    await loadScanHistory();
    setRefreshing(false);
  };

  const handleScanPress = (scan: ScanResult) => {
    console.log('Navigating to scan details:', scan.id);
    router.push({
      pathname: '/scan-details',
      params: { scanId: scan.id }
    });
  };

  const handleDeleteScan = (scan: ScanResult) => {
    Alert.alert(
      'Delete Scan',
      'Are you sure you want to delete this scan?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteScanResult(scan.id);
              await loadScanHistory();
            } catch (error) {
              Alert.alert('Error', 'Failed to delete scan');
            }
          },
        },
      ]
    );
  };

  return (
    <View className="flex-1 bg-black">
      <ScrollView 
        className="flex-1" 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 20 }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#ffffff"
          />
        }
      >
        {/* Quick Actions Section */}
        <View className="px-6 pt-6 pb-8">
          <Text className="text-xl font-bold text-white mb-4">
            Quick Actions
          </Text>
          <View className="gap-3">
            <Button 
              className="h-14 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl shadow-lg"
              onPress={() => router.push('/(tabs)/live-scan' as any)}
            >
              <View className="flex-row items-center gap-2">
                <Icon as={ShieldCheckIcon} size={20} color="#ffffff" />
                <Text className="text-white font-bold text-base">
                  🔴 Start Live Scan (Real-time)
                </Text>
              </View>
            </Button>
            <Button 
              className="h-12 bg-white rounded-lg"
              onPress={() => router.push('/(tabs)/scan')}
            >
              <Text className="text-black font-bold text-base">
                📸 Photo Scan (Detailed)
              </Text>
            </Button>
            <Button 
              className="h-12 bg-white/20 rounded-lg border border-white/40"
              onPress={() => router.push('/(tabs)/dashboard')}
            >
              <Text className="text-white font-bold text-base">
                View Dashboard
              </Text>
            </Button>
          </View>
        </View>

        {/* Scan History Section */}
        <View className="px-6">
          <Text className="text-xl font-bold text-white mb-4">
            Scan History ({scanHistory.length})
          </Text>
          {scanHistory.length > 0 ? (
            <View className="gap-3">
              {scanHistory.map((scan, index) => (
                <Pressable
                  key={scan.id}
                  onPress={() => handleScanPress(scan)}
                  onLongPress={() => handleDeleteScan(scan)}
                  className="flex-row items-center justify-between p-4 rounded-xl bg-white/5 border border-white/20 active:bg-white/10"
                >
                  <View className="flex-row items-center flex-1">
                    {/* Icon Container */}
                    <View className="w-12 h-12 flex-shrink-0 items-center justify-center rounded-lg bg-white/10 mr-4">
                      <Icon 
                        as={ShieldCheckIcon} 
                        size={24} 
                        color="#ffffff"
                      />
                    </View>
                    
                    {/* Scan Info */}
                    <View className="flex-1">
                      <Text className="font-semibold text-white text-base">
                        Scan #{scanHistory.length - index}
                      </Text>
                      <View className="flex-row items-center gap-2 mt-1">
                        <Icon as={ClockIcon} size={12} color="#ffffff80" />
                        <Text className="text-sm text-white/60">
                          {scan.dateTime}
                        </Text>
                      </View>
                    </View>
                  </View>

                  {/* Objects Count Badge */}
                  <View className="bg-white px-3 py-1 rounded-full">
                    <Text className="text-black text-xs font-bold">
                      {scan.totalObjects} obj
                    </Text>
                  </View>
                </Pressable>
              ))}
            </View>
          ) : (
            <View className="bg-white/5 p-6 rounded-xl border border-white/20 items-center">
              <Text className="text-white/60 text-center text-base">
                No scans yet. Start scanning to see your history here.
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
}
