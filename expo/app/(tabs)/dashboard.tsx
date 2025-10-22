import { DashboardHeader } from '@/components/dashboard/dashboard-header';
import { StatCard } from '@/components/dashboard/stat-card';
import { ComparisonCard } from '@/components/dashboard/comparison-card';
import { MapCard } from '@/components/dashboard/map-card';
import { ObjectChart } from '@/components/dashboard/object-chart';
import { CylinderPieChart } from '@/components/dashboard/cylinder-pie-chart';
import { Text } from '@/components/ui/text';
import * as React from 'react';
import { ScrollView, View, RefreshControl, ActivityIndicator } from 'react-native';
import { getScanHistory } from '@/lib/storage';
import { analyzeScanData, getCylinderStats } from '@/lib/analytics';
import { useFocusEffect } from '@react-navigation/native';

export default function DashboardScreen() {
  const [loading, setLoading] = React.useState(true);
  const [refreshing, setRefreshing] = React.useState(false);
  const [stats, setStats] = React.useState<ReturnType<typeof analyzeScanData> | null>(null);
  const [cylinderStats, setCylinderStats] = React.useState<ReturnType<typeof getCylinderStats> | null>(null);

  const loadData = async () => {
    try {
      const scans = await getScanHistory();
      const analyzedStats = analyzeScanData(scans);
      const cylStats = getCylinderStats(scans);
      
      setStats(analyzedStats);
      setCylinderStats(cylStats);
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      loadData();
    }, [])
  );

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  if (loading) {
    return (
      <View className="flex-1 bg-black items-center justify-center">
        <ActivityIndicator size="large" color="#ffffff" />
        <Text className="text-white mt-4">Loading dashboard...</Text>
      </View>
    );
  }

  if (!stats) {
    return (
      <View className="flex-1 bg-black items-center justify-center px-6">
        <Text className="text-white/60 text-center">
          No data available. Start scanning to see analytics.
        </Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-black">
      <ScrollView 
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
        {/* Header */}
        <DashboardHeader 
          title="Analytics Dashboard"
          description="Real-time insights from your scans"
        />

        {/* Stats Cards */}
        <View className="px-6">
          <StatCard 
            title="Total Scans"
            description="Total number of scans performed."
            value={stats.totalScans.toString()}
            trend=""
            trendPositive={true}
          />

          <StatCard 
            title="Objects Detected"
            description="Total objects found across all scans."
            value={stats.totalObjectsDetected.toString()}
            trend=""
            trendPositive={true}
          />

          <StatCard 
            title="Average Confidence"
            description="Average detection confidence score."
            value={`${(stats.averageConfidence * 100).toFixed(1)}%`}
            trend=""
            trendPositive={true}
          />

          <StatCard 
            title="Avg Inference Time"
            description="Average processing time per scan."
            value={`${stats.averageInferenceTime.toFixed(0)}ms`}
            trend=""
            trendPositive={true}
          />

          {/* Cylinder Stats */}
          {cylinderStats && cylinderStats.totalCylinders > 0 && (
            <View className="bg-white/5 rounded-xl border border-white/20 p-4 mb-4">
              <Text className="text-white text-lg font-semibold mb-2">Cylinder Detection</Text>
              <Text className="text-white/70 text-sm mb-4">
                Total gas cylinders detected across all scans
              </Text>
              <View className="flex-row items-baseline gap-2">
                <Text className="text-white text-4xl font-bold">{cylinderStats.totalCylinders}</Text>
                <Text className="text-white/60 text-lg">cylinders</Text>
              </View>
            </View>
          )}

          {/* Object Distribution Chart */}
          {stats.mostDetectedObjects.length > 0 && (
            <View className="mb-4">
              <ObjectChart data={stats.mostDetectedObjects} />
            </View>
          )}

          {/* Cylinder Type Distribution */}
          {cylinderStats && cylinderStats.cylinderBreakdown.length > 0 && (
            <View className="mb-4">
              <CylinderPieChart data={cylinderStats.cylinderBreakdown} />
            </View>
          )}

          {/* Top Detected Objects List */}
          {stats.mostDetectedObjects.length > 0 && (
            <View className="bg-white/5 rounded-xl border border-white/20 p-4 mb-4">
              <Text className="text-white text-lg font-semibold mb-3">Top Detected Objects</Text>
              {stats.mostDetectedObjects.map((obj, index) => {
                const colors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];
                const color = colors[index % colors.length];
                return (
                  <View 
                    key={index}
                    className="flex-row items-center justify-between py-3 border-b border-white/10"
                  >
                    <View className="flex-row items-center gap-3">
                      <View 
                        className="w-8 h-8 rounded-full items-center justify-center"
                        style={{ backgroundColor: color }}
                      >
                        <Text className="text-white font-bold text-sm">{index + 1}</Text>
                      </View>
                      <Text className="text-white font-medium">{obj.name}</Text>
                    </View>
                    <View className="items-end">
                      <Text className="text-white font-bold">{obj.count}</Text>
                      <Text className="text-white/60 text-xs">{obj.percentage.toFixed(1)}%</Text>
                    </View>
                  </View>
                );
              })}
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
}
