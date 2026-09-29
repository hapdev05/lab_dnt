import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Animated,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';

const { width } = Dimensions.get('window');

export default function IAmRichScreen() {
  const [tapCount, setTapCount] = useState(0);
  const [scaleAnim] = useState(new Animated.Value(1));

  const handlePressJewel = () => {
    setTapCount((prev) => prev + 1);
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 1.15,
        duration: 120,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 3,
        tension: 40,
        useNativeDriver: true,
      }),
    ]).start();
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.badgeText}>LAB 1 • REACT NATIVE FROM SCRATCH</Text>
        <Text style={styles.title}>I Am Rich</Text>
        <Text style={styles.subtitle}>
          "I deserve it. I am good, healthy & successful."
        </Text>
      </View>

      {/* Diamond / Ruby Graphic */}
      <View style={styles.centerArea}>
        <TouchableOpacity
          activeOpacity={0.85}
          onPress={handlePressJewel}
          style={styles.gemWrapper}>
          <Animated.View
            style={[
              styles.gemGlowContainer,
              { transform: [{ scale: scaleAnim }] },
            ]}>
            <View style={styles.glowRing} />
            <View style={styles.diamondCrown}>
              {/* Top facets */}
              <View style={styles.topFacetsRow}>
                <View style={styles.facetLeft} />
                <View style={styles.facetCenterTop} />
                <View style={styles.facetRight} />
              </View>
              {/* Table / Middle facet */}
              <View style={styles.facetMiddle}>
                <Text style={styles.gemSparkle}>✦</Text>
              </View>
              {/* Bottom pavilion */}
              <View style={styles.bottomPavilion}>
                <View style={styles.pavilionLeft} />
                <View style={styles.pavilionCenter} />
                <View style={styles.pavilionRight} />
              </View>
            </View>
          </Animated.View>
        </TouchableOpacity>

        <Text style={styles.tapPrompt}>Tap diamond to shine</Text>
      </View>

      {/* Luxury Stats Card */}
      <View style={styles.card}>
        <View style={styles.statRow}>
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>STATUS</Text>
            <Text style={styles.statValue}>ULTRA WEALTHY</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>AFFIRMATIONS</Text>
            <Text style={styles.statValue}>{tapCount} SHINES</Text>
          </View>
        </View>
        <Text style={styles.cardFooter}>
          💎 Pure React Native component built from scratch
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0d1117',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 24,
    paddingHorizontal: 20,
  },
  header: {
    alignItems: 'center',
    marginTop: 12,
  },
  badgeText: {
    color: '#E2B857',
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 2,
    marginBottom: 8,
  },
  title: {
    fontSize: 40,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 1.5,
    textShadowColor: 'rgba(226, 184, 87, 0.4)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 10,
  },
  subtitle: {
    fontSize: 14,
    color: '#94A3B8',
    fontStyle: 'italic',
    textAlign: 'center',
    marginTop: 8,
    maxWidth: 280,
  },
  centerArea: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  gemWrapper: {
    padding: 20,
  },
  gemGlowContainer: {
    width: 220,
    height: 220,
    alignItems: 'center',
    justifyContent: 'center',
  },
  glowRing: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: 'rgba(226, 54, 112, 0.25)',
    shadowColor: '#E23670',
    shadowOpacity: 0.9,
    shadowRadius: 30,
  },
  diamondCrown: {
    width: 170,
    height: 160,
    alignItems: 'center',
    justifyContent: 'center',
  },
  topFacetsRow: {
    flexDirection: 'row',
    width: 150,
    height: 35,
    justifyContent: 'center',
  },
  facetLeft: {
    width: 40,
    height: 35,
    backgroundColor: '#FF6B8B',
    transform: [{ skewX: '-30deg' }],
    borderTopLeftRadius: 6,
    borderWidth: 1,
    borderColor: '#FFA5B9',
  },
  facetCenterTop: {
    width: 60,
    height: 35,
    backgroundColor: '#FF477E',
    borderWidth: 1,
    borderColor: '#FFA5B9',
  },
  facetRight: {
    width: 40,
    height: 35,
    backgroundColor: '#D6225B',
    transform: [{ skewX: '30deg' }],
    borderTopRightRadius: 6,
    borderWidth: 1,
    borderColor: '#FFA5B9',
  },
  facetMiddle: {
    width: 164,
    height: 38,
    backgroundColor: '#E60049',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#FFCCD5',
    zIndex: 2,
  },
  gemSparkle: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: 'bold',
  },
  bottomPavilion: {
    flexDirection: 'row',
    width: 164,
    height: 85,
    justifyContent: 'center',
  },
  pavilionLeft: {
    width: 46,
    height: 85,
    backgroundColor: '#980036',
    transform: [{ skewX: '22deg' }],
    borderWidth: 1,
    borderColor: '#FF477E',
  },
  pavilionCenter: {
    width: 72,
    height: 85,
    backgroundColor: '#C50043',
    borderWidth: 1,
    borderColor: '#FF7096',
  },
  pavilionRight: {
    width: 46,
    height: 85,
    backgroundColor: '#6A0024',
    transform: [{ skewX: '-22deg' }],
    borderWidth: 1,
    borderColor: '#FF477E',
  },
  tapPrompt: {
    color: '#64748B',
    fontSize: 13,
    marginTop: 14,
    letterSpacing: 1,
  },
  card: {
    width: Math.min(width - 40, 360),
    backgroundColor: '#161B22',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(226, 184, 87, 0.3)',
    shadowColor: '#000',
    shadowOpacity: 0.4,
    shadowRadius: 10,
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginBottom: 12,
  },
  statItem: {
    alignItems: 'center',
  },
  statLabel: {
    color: '#8B949E',
    fontSize: 11,
    letterSpacing: 1.2,
    fontWeight: '600',
    marginBottom: 4,
  },
  statValue: {
    color: '#F0883E',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  divider: {
    width: 1,
    height: 30,
    backgroundColor: '#30363D',
  },
  cardFooter: {
    color: '#8B949E',
    fontSize: 12,
    textAlign: 'center',
    borderTopWidth: 1,
    borderTopColor: '#21262D',
    paddingTop: 10,
  },
});
