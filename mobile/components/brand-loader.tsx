import { Image } from 'expo-image';
import { useEffect, useMemo, useRef } from 'react';
import { Animated, Easing, StyleSheet, Text, View } from 'react-native';

type BrandLoaderProps = {
  subtitle?: string;
};

export function BrandLoader({ subtitle = 'Loading your experience' }: BrandLoaderProps) {
  const spin = useRef(new Animated.Value(0)).current;
  const reverseSpin = useRef(new Animated.Value(0)).current;
  const pulse = useRef(new Animated.Value(0)).current;
  const progress = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const spinLoop = Animated.loop(
      Animated.timing(spin, {
        toValue: 1,
        duration: 1300,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
    );

    const reverseSpinLoop = Animated.loop(
      Animated.timing(reverseSpin, {
        toValue: 1,
        duration: 2200,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
    );

    const pulseLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, {
          toValue: 1,
          duration: 800,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(pulse, {
          toValue: 0,
          duration: 800,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
      ]),
    );

    const progressLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(progress, {
          toValue: 1,
          duration: 1100,
          easing: Easing.inOut(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(progress, {
          toValue: 0,
          duration: 1100,
          easing: Easing.inOut(Easing.cubic),
          useNativeDriver: true,
        }),
      ]),
    );

    spinLoop.start();
    reverseSpinLoop.start();
    pulseLoop.start();
    progressLoop.start();

    return () => {
      spinLoop.stop();
      reverseSpinLoop.stop();
      pulseLoop.stop();
      progressLoop.stop();
    };
  }, [pulse, progress, reverseSpin, spin]);

  const spinRotate = useMemo(
    () =>
      spin.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '360deg'],
      }),
    [spin],
  );

  const reverseRotate = useMemo(
    () =>
      reverseSpin.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '-360deg'],
      }),
    [reverseSpin],
  );

  const pulseScale = useMemo(
    () =>
      pulse.interpolate({
        inputRange: [0, 1],
        outputRange: [1, 1.08],
      }),
    [pulse],
  );

  const progressTranslate = useMemo(
    () =>
      progress.interpolate({
        inputRange: [0, 1],
        outputRange: [-70, 90],
      }),
    [progress],
  );

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.glow, { transform: [{ scale: pulseScale }], opacity: 0.35 }]} />

      <View style={styles.logoStack}>
        <Animated.View style={[styles.ringOuter, { transform: [{ rotate: spinRotate }] }]} />
        <Animated.View style={[styles.ringInner, { transform: [{ rotate: reverseRotate }] }]} />
        <Animated.View style={[styles.logoWrap, { transform: [{ scale: pulseScale }] }]}>
          <Image source={require('@/assets/images/logo.png')} style={styles.logo} contentFit="cover" />
        </Animated.View>
      </View>

      <Text style={styles.title}>themrktplace</Text>
      <Text style={styles.subtitle}>{subtitle}</Text>

      <View style={styles.barTrack}>
        <Animated.View style={[styles.barFill, { transform: [{ translateX: progressTranslate }] }]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  glow: {
    position: 'absolute',
    width: 220,
    height: 220,
    borderRadius: 999,
    backgroundColor: '#E5E7EB',
  },
  logoStack: {
    width: 116,
    height: 116,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  ringOuter: {
    position: 'absolute',
    width: 96,
    height: 96,
    borderRadius: 999,
    borderWidth: 3,
    borderColor: '#84D347',
    borderRightColor: 'transparent',
    borderBottomColor: 'transparent',
  },
  ringInner: {
    position: 'absolute',
    width: 70,
    height: 70,
    borderRadius: 999,
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: '#D1D5DB',
  },
  logoWrap: {
    width: 44,
    height: 44,
    borderRadius: 14,
    overflow: 'hidden',
    backgroundColor: '#FFFFFF',
    shadowColor: '#000000',
    shadowOpacity: 0.18,
    shadowOffset: { width: 0, height: 8 },
    shadowRadius: 16,
    elevation: 6,
  },
  logo: {
    width: '100%',
    height: '100%',
  },
  title: {
    fontSize: 24,
    fontWeight: '900',
    letterSpacing: -0.7,
    color: '#111111',
  },
  subtitle: {
    marginTop: 6,
    marginBottom: 18,
    fontSize: 13,
    fontWeight: '600',
    letterSpacing: 0.4,
    color: '#6B7280',
    textTransform: 'uppercase',
  },
  barTrack: {
    width: 160,
    height: 4,
    borderRadius: 999,
    overflow: 'hidden',
    backgroundColor: '#ECECEC',
  },
  barFill: {
    width: 70,
    height: '100%',
    borderRadius: 999,
    backgroundColor: '#111111',
  },
});