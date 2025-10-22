import { Redirect } from 'expo-router';

export default function Index() {
  // Redirect to tabs - the layout will handle auth
  return <Redirect href="/(tabs)/home" />;
}
