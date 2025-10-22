import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { useRouter } from 'expo-router';
import * as React from 'react';
import { View, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
  withSequence,
  Easing,
} from 'react-native-reanimated';
import Svg, { Circle, Path } from 'react-native-svg';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

function OrbitIcon() {
  // Animation values
  const rotation = useSharedValue(0);
  const satelliteRotation = useSharedValue(0);

  React.useEffect(() => {
    // Planet orbit animation
    rotation.value = withRepeat(
      withTiming(360, {
        duration: 8000,
        easing: Easing.linear,
      }),
      -1
    );

    // Satellite orbit animation (faster)
    satelliteRotation.value = withRepeat(
      withTiming(360, {
        duration: 3000,
        easing: Easing.linear,
      }),
      -1
    );
  }, []);

  const orbitAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ rotate: `${rotation.value}deg` }],
    };
  });

  const satelliteAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ rotate: `${satelliteRotation.value}deg` }],
    };
  });

  return (
    <View style={styles.iconContainer}>
      {/* Background orbit circles */}
      <Svg width="280" height="280" viewBox="0 0 280 280" style={styles.orbitSvg}>
        {/* Main planet orbit (dashed circle) */}
        <Circle
          cx="140"
          cy="140"
          r="80"
          stroke="rgba(255, 255, 255, 0.15)"
          strokeWidth="2"
          strokeDasharray="8 8"
          fill="none"
        />
        
        {/* Secondary orbit trail */}
        <Circle
          cx="140"
          cy="140"
          r="50"
          stroke="rgba(255, 255, 255, 0.08)"
          strokeWidth="1.5"
          strokeDasharray="4 6"
          fill="none"
        />
      </Svg>

      {/* Animated orbiting planet */}
      <Animated.View style={[styles.orbitContainer, orbitAnimatedStyle]}>
        <View style={styles.planetContainer}>
          <Svg width="40" height="40" viewBox="0 0 40 40">
            <Circle cx="20" cy="20" r="18" fill="rgba(255, 255, 255, 0.12)" />
            <Circle cx="20" cy="20" r="14" fill="rgba(255, 255, 255, 0.2)" />
            {/* Surface details */}
            <Circle cx="14" cy="16" r="3" fill="rgba(255, 255, 255, 0.1)" />
            <Circle cx="24" cy="22" r="2.5" fill="rgba(255, 255, 255, 0.1)" />
          </Svg>
        </View>
      </Animated.View>

      {/* Animated satellite */}
      <Animated.View style={[styles.satelliteOrbitContainer, satelliteAnimatedStyle]}>
        <View style={styles.satelliteContainer}>
          <Svg width="16" height="16" viewBox="0 0 16 16">
            <Circle cx="8" cy="8" r="6" fill="rgba(255, 255, 255, 0.9)" />
            <Circle cx="8" cy="8" r="4" fill="rgba(255, 255, 255, 0.6)" />
          </Svg>
        </View>
      </Animated.View>

      {/* Central planet/core */}
      <View style={styles.centerPlanet}>
        <Svg width="180" height="180" viewBox="0 0 180 180">
          {/* Outer glow */}
          <Circle cx="90" cy="90" r="85" fill="rgba(255, 255, 255, 0.03)" />
          <Circle cx="90" cy="90" r="70" fill="rgba(255, 255, 255, 0.05)" />
          
          {/* Main planet */}
          <Circle cx="90" cy="90" r="60" fill="rgba(255, 255, 255, 0.08)" />
          <Circle cx="90" cy="90" r="55" fill="rgba(255, 255, 255, 0.12)" />
          
          {/* Planet details - subtle surface features */}
          <Path
            d="M 50 90 Q 70 70, 90 90 T 130 90"
            stroke="rgba(255, 255, 255, 0.06)"
            strokeWidth="1.5"
            fill="none"
            strokeDasharray="4 4"
          />
          <Path
            d="M 60 70 Q 90 60, 120 70"
            stroke="rgba(255, 255, 255, 0.06)"
            strokeWidth="1"
            fill="none"
          />
          <Path
            d="M 60 110 Q 90 120, 120 110"
            stroke="rgba(255, 255, 255, 0.06)"
            strokeWidth="1"
            fill="none"
          />
          
          {/* Surface craters/spots */}
          <Circle cx="70" cy="75" r="8" fill="rgba(255, 255, 255, 0.06)" />
          <Circle cx="105" cy="85" r="6" fill="rgba(255, 255, 255, 0.06)" />
          <Circle cx="85" cy="105" r="7" fill="rgba(255, 255, 255, 0.06)" />
        </Svg>
      </View>
    </View>
  );
}

export default function WelcomeScreen() {
  const router = useRouter();

  const handleStartScan = () => {
    router.push('/(auth)/sign-in');
  };

  const handleViewDashboard = () => {
    router.push('/(auth)/sign-in');
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <View style={styles.content}>
        {/* Animated Orbit Icon */}
        <View style={styles.iconWrapper}>
          <OrbitIcon />
        </View>

        {/* Title */}
        <Text variant="h1" style={styles.title}>
          SafeOrbit
        </Text>

        {/* Subtitle */}
        <Text style={styles.subtitle}>
          AI-Powered Safety Monitoring for Space{'\n'}& Industry
        </Text>

        {/* Buttons */}
        <View style={styles.buttonContainer}>
          <Button
            onPress={handleStartScan}
            style={styles.primaryButton}
            className="w-full rounded-2xl h-16 bg-white active:bg-white/90"
          >
            <Text style={styles.primaryButtonText}>Start Scan</Text>
          </Button>

          <Button
            onPress={handleViewDashboard}
            variant="outline"
            style={styles.secondaryButton}
            className="w-full rounded-2xl h-16 border-2 border-white/30 bg-transparent active:bg-white/5"
          >
            <Text style={styles.secondaryButtonText}>View Dashboard</Text>
          </Button>
        </View>

        {/* Footer */}
        <Text style={styles.footer}>
          Powered by YOLO + Falcon AI
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  iconWrapper: {
    marginBottom: 40,
  },
  iconContainer: {
    width: 280,
    height: 280,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  orbitSvg: {
    position: 'absolute',
  },
  orbitContainer: {
    position: 'absolute',
    width: 160,
    height: 160,
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  planetContainer: {
    position: 'absolute',
    top: 0,
  },
  satelliteOrbitContainer: {
    position: 'absolute',
    width: 100,
    height: 100,
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  satelliteContainer: {
    position: 'absolute',
    top: 0,
  },
  centerPlanet: {
    position: 'absolute',
  },
  title: {
    fontSize: 48,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 16,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: '400',
    color: 'rgba(255, 255, 255, 0.7)',
    textAlign: 'center',
    lineHeight: 28,
    marginBottom: 60,
  },
  buttonContainer: {
    width: '100%',
    gap: 16,
    paddingHorizontal: 20,
  },
  primaryButton: {
    borderRadius: 16,
    height: 64,
    shadowColor: 'rgba(255, 255, 255, 0.1)',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 12,
  },
  primaryButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000000',
  },
  secondaryButton: {
    borderRadius: 16,
    height: 64,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  secondaryButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  footer: {
    position: 'absolute',
    bottom: 40,
    fontSize: 14,
    fontWeight: '400',
    color: 'rgba(255, 255, 255, 0.4)',
    textAlign: 'center',
  },
});
