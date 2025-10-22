import { SettingsSection } from '@/components/settings/settings-section';
import { SettingsItem } from '@/components/settings/settings-item';
import { SettingsToggle } from '@/components/settings/settings-toggle';
import * as React from 'react';
import { ScrollView, View } from 'react-native';

export default function SettingsScreen() {
  const [pushNotifications, setPushNotifications] = React.useState(true);
  const [emailNotifications, setEmailNotifications] = React.useState(false);

  return (
    <View className="flex-1 bg-black dark:bg-black">
      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 10, marginTop: 20 }}
      >
        {/* Preferences Section */}
        <SettingsSection title="PREFERENCES">
          <SettingsItem 
            title="Appearance"
            subtitle="Dark"
            value="System"
            onPress={() => {
              // Handle appearance change
              console.log('Appearance pressed');
            }}
          />
          <SettingsItem 
            title="Language"
            subtitle="English"
            value="English"
            onPress={() => {
              // Handle language change
              console.log('Language pressed');
            }}
          />
          <SettingsItem 
            title="Time Format"
            subtitle="24-hour"
            value="24-hour"
            onPress={() => {
              // Handle time format change
              console.log('Time Format pressed');
            }}
          />
        </SettingsSection>

        {/* Notifications Section */}
        <SettingsSection title="NOTIFICATIONS">
          <SettingsToggle 
            title="Push Notifications"
            subtitle="On"
            value={pushNotifications}
            onValueChange={setPushNotifications}
          />
          <SettingsToggle 
            title="Email Notifications"
            subtitle="Off"
            value={emailNotifications}
            onValueChange={setEmailNotifications}
          />
        </SettingsSection>

        {/* App Information Section */}
        <SettingsSection title="APP INFORMATION">
          <SettingsItem 
            title="About SafeOrbit"
            showArrow={true}
            onPress={() => {
              // Handle about press
              console.log('About pressed');
            }}
          />
          <SettingsItem 
            title="Terms of Service"
            showArrow={true}
            onPress={() => {
              // Handle terms press
              console.log('Terms pressed');
            }}
          />
          <SettingsItem 
            title="Privacy Policy"
            showArrow={true}
            onPress={() => {
              // Handle privacy press
              console.log('Privacy pressed');
            }}
          />
          <SettingsItem 
            title="Contact Us"
            showArrow={true}
            onPress={() => {
              // Handle contact press
              console.log('Contact pressed');
            }}
          />
        </SettingsSection>
      </ScrollView>
    </View>
  );
}
