import React, { useState, useRef } from 'react';
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

interface DieProps {
  value: number;
  onPress: () => void;
  animValue: Animated.Value;
}

function Die({ value, onPress, animValue }: DieProps) {
  const rotateInterpolate = animValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const scaleInterpolate = animValue.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [1, 0.8, 1],
  });

  // Render dots for dice faces 1 to 6
  const renderDots = () => {
    switch (value) {
      case 1:
        return (
          <View style={styles.diceFace}>
            <View style={[styles.dot, styles.dotCenter]} />
          </View>
        );
      case 2:
        return (
          <View style={[styles.diceFace, styles.faceBetween]}>
            <View style={[styles.dot, styles.dotTopLeft]} />
            <View style={[styles.dot, styles.dotBottomRight]} />
          </View>
        );
      case 3:
        return (
          <View style={[styles.diceFace, styles.faceBetween]}>
            <View style={[styles.dot, styles.dotTopLeft]} />
            <View style={[styles.dot, styles.dotCenter]} />
            <View style={[styles.dot, styles.dotBottomRight]} />
          </View>
        );
      case 4:
        return (
          <View style={[styles.diceFace, styles.faceGrid]}>
            <View style={styles.dotRow}>
              <View style={styles.dot} />
              <View style={styles.dot} />
            </View>
            <View style={styles.dotRow}>
              <View style={styles.dot} />
              <View style={styles.dot} />
            </View>
          </View>
        );
      case 5:
        return (
          <View style={[styles.diceFace, styles.faceGrid]}>
            <View style={styles.dotRow}>
              <View style={styles.dot} />
              <View style={styles.dot} />
            </View>
            <View style={styles.dotCenterSingle}>
              <View style={styles.dot} />
            </View>
            <View style={styles.dotRow}>
              <View style={styles.dot} />
              <View style={styles.dot} />
            </View>
          </View>
        );
      case 6:
      default:
        return (
          <View style={[styles.diceFace, styles.faceGrid]}>
            <View style={styles.dotRow}>
              <View style={styles.dot} />
              <View style={styles.dot} />
            </View>
            <View style={styles.dotRow}>
              <View style={styles.dot} />
              <View style={styles.dot} />
            </View>
            <View style={styles.dotRow}>
              <View style={styles.dot} />
              <View style={styles.dot} />
            </View>
          </View>
        );
    }
  };

  return (
    <TouchableOpacity activeOpacity={0.8} onPress={onPress}>
      <Animated.View
        style={[
          styles.dieBox,
          {
            transform: [
              { rotate: rotateInterpolate },
              { scale: scaleInterpolate },
            ],
          },
        ]}>
        {renderDots()}
      </Animated.View>
    </TouchableOpacity>
  );
}

export default function DiceScreen() {
  const [leftDiceNumber, setLeftDiceNumber] = useState(1);
  const [rightDiceNumber, setRightDiceNumber] = useState(2);
  const [rollCount, setRollCount] = useState(0);
  const [isRolling, setIsRolling] = useState(false);

  const leftAnim = useRef(new Animated.Value(0)).current;
  const rightAnim = useRef(new Animated.Value(0)).current;

  const rollDice = () => {
    if (isRolling) return;
    setIsRolling(true);

    leftAnim.setValue(0);
    rightAnim.setValue(0);

    Animated.parallel([
      Animated.timing(leftAnim, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
      Animated.timing(rightAnim, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
    ]).start(() => {
      const newLeft = Math.floor(Math.random() * 6) + 1;
      const newRight = Math.floor(Math.random() * 6) + 1;
      setLeftDiceNumber(newLeft);
      setRightDiceNumber(newRight);
      setRollCount((c) => c + 1);
      setIsRolling(false);
    });
  };

  const isDouble = leftDiceNumber === rightDiceNumber;
  const total = leftDiceNumber + rightDiceNumber;

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>LAB 3 • REACT STATE & PROPS</Text>
        </View>
        <Text style={styles.title}>Dice Roller</Text>
        <Text style={styles.subtitle}>Tap either die or press Roll to play</Text>
      </View>

      {/* Dice Container */}
      <View style={styles.diceSection}>
        <View style={styles.diceRow}>
          <Die
            value={leftDiceNumber}
            onPress={rollDice}
            animValue={leftAnim}
          />
          <Die
            value={rightDiceNumber}
            onPress={rollDice}
            animValue={rightAnim}
          />
        </View>

        {/* Status Message */}
        <View style={styles.statusBox}>
          {isDouble ? (
            <Text style={styles.jackpotText}>
              🎉 DOUBLE {leftDiceNumber}! BONUS POINTS! 🎉
            </Text>
          ) : (
            <Text style={styles.totalText}>Total Roll: {total}</Text>
          )}
        </View>
      </View>

      {/* Controls & Stats */}
      <View style={styles.bottomSection}>
        <TouchableOpacity
          activeOpacity={0.8}
          style={[styles.rollButton, isRolling && styles.rollButtonDisabled]}
          onPress={rollDice}
          disabled={isRolling}>
          <Text style={styles.rollButtonText}>
            {isRolling ? '🎲 ROLLING...' : '🎲 ROLL DICE'}
          </Text>
        </TouchableOpacity>

        <View style={styles.statsCard}>
          <View style={styles.statCol}>
            <Text style={styles.statLabel}>LEFT DIE</Text>
            <Text style={styles.statNum}>{leftDiceNumber}</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statCol}>
            <Text style={styles.statLabel}>RIGHT DIE</Text>
            <Text style={styles.statNum}>{rightDiceNumber}</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statCol}>
            <Text style={styles.statLabel}>TOTAL ROLLS</Text>
            <Text style={styles.statNum}>{rollCount}</Text>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#7F1D1D', // Deep casino red
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 20,
    paddingHorizontal: 20,
  },
  header: {
    alignItems: 'center',
    marginTop: 10,
  },
  badge: {
    backgroundColor: 'rgba(254, 226, 226, 0.2)',
    paddingHorizontal: 14,
    paddingVertical: 5,
    borderRadius: 20,
    marginBottom: 8,
  },
  badgeText: {
    color: '#FECACA',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.5,
  },
  title: {
    fontSize: 34,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 1,
  },
  subtitle: {
    fontSize: 13,
    color: '#FCA5A5',
    marginTop: 4,
  },
  diceSection: {
    alignItems: 'center',
    width: '100%',
  },
  diceRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 24,
  },
  dieBox: {
    width: width * 0.38,
    height: width * 0.38,
    maxWidth: 150,
    maxHeight: 150,
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 8,
    borderWidth: 4,
    borderColor: '#FEE2E2',
    justifyContent: 'center',
    alignItems: 'center',
  },
  diceFace: {
    width: '100%',
    height: '100%',
    position: 'relative',
  },
  faceBetween: {
    justifyContent: 'space-between',
  },
  faceGrid: {
    justifyContent: 'space-between',
  },
  dotRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  dotCenterSingle: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  dot: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#DC2626', // Vibrant red dots
  },
  dotCenter: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: -10,
    marginLeft: -10,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#991B1B',
  },
  dotTopLeft: {
    alignSelf: 'flex-start',
  },
  dotBottomRight: {
    alignSelf: 'flex-end',
  },
  statusBox: {
    marginTop: 28,
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.25)',
    borderRadius: 20,
  },
  totalText: {
    color: '#FEF2F2',
    fontSize: 18,
    fontWeight: '700',
  },
  jackpotText: {
    color: '#FEF08A',
    fontSize: 16,
    fontWeight: '800',
    textAlign: 'center',
  },
  bottomSection: {
    width: '100%',
    maxWidth: 380,
    gap: 16,
  },
  rollButton: {
    backgroundColor: '#FEF2F2',
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
  },
  rollButtonDisabled: {
    opacity: 0.6,
  },
  rollButtonText: {
    color: '#991B1B',
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: 1.2,
  },
  statsCard: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#991B1B',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#B91C1C',
  },
  statCol: {
    alignItems: 'center',
  },
  statLabel: {
    color: '#FCA5A5',
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1,
    marginBottom: 4,
  },
  statNum: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '800',
  },
  statDivider: {
    width: 1,
    height: 30,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
});
