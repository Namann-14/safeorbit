import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { UserMenu } from '@/components/user-menu';
import { Tabs } from 'expo-router';
import { HomeIcon, ScanIcon, SettingsIcon, MoonStarIcon, SunIcon, LayoutDashboard, VideoIcon } from 'lucide-react-native';
import { useColorScheme } from 'nativewind';
import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const THEME_ICONS = {
  light: SunIcon,
  dark: MoonStarIcon,
};

function ThemeToggle() {
  const { colorScheme, toggleColorScheme } = useColorScheme();

  return (
    <Button onPress={toggleColorScheme} size="icon" variant="ghost" className="rounded-full">
      <Icon as={THEME_ICONS[colorScheme ?? 'light']} className="size-6" />
    </Button>
  );
}

function TabHeader() {
  const insets = useSafeAreaInsets();
  
  return (
    <View 
      className="flex-row justify-between bg-background px-4 pb-3 border-b border-border"
      style={{ paddingTop: insets.top + 12 }}
    >
      <ThemeToggle />
      <UserMenu />
    </View>
  );
}

export default function TabsLayout() {
  const { colorScheme } = useColorScheme();

  const iconColor = colorScheme === 'dark' ? '#ffffff' : '#000000';
  const inactiveIconColor = colorScheme === 'dark' ? '#666666' : '#999999';

  return (
    <Tabs
      screenOptions={{
        headerShown: true,
        header: () => <TabHeader />,
        tabBarActiveTintColor: iconColor,
        tabBarInactiveTintColor: inactiveIconColor,
        tabBarStyle: {
          backgroundColor: colorScheme === 'dark' ? '#000000' : '#ffffff',
          borderTopColor: colorScheme === 'dark' ? '#1a1a1a' : '#e5e5e5',
          paddingTop: 8,
          paddingBottom: 8,
          marginBottom: 8,
          height: 70,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '500',
          marginTop: 1,
        },
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, size }) => (
            <Icon as={HomeIcon} size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="scan"
        options={{
          title: 'Photo',
          tabBarIcon: ({ color, size }) => (
            <Icon as={ScanIcon} size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="live-scan"
        options={{
          title: 'Live Scan',
          tabBarIcon: ({ color, size }) => (
            <Icon as={VideoIcon} size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="dashboard"
        options={{
          title: 'Dashboard',
          tabBarIcon: ({ color, size }) => (
            <Icon as={LayoutDashboard} size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarIcon: ({ color, size }) => (
            <Icon as={SettingsIcon} size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
