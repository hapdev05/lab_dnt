import React, { useState, useRef } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Platform,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';

const { width } = Dimensions.get('window');

interface XyloKey {
  noteNumber: number;
  noteName: string;
  solfege: string;
  frequency: number;
  color: string;
  activeColor: string;
  widthPercent: string;
}

const XYLOPHONE_KEYS: XyloKey[] = [
  {
    noteNumber: 1,
    noteName: 'C4',
    solfege: 'DO',
    frequency: 261.63,
    color: '#EF4444',
    activeColor: '#FCA5A5',
    widthPercent: '100%',
  },
  {
    noteNumber: 2,
    noteName: 'D4',
    solfege: 'RE',
    frequency: 293.66,
    color: '#F97316',
    activeColor: '#FDBA74',
    widthPercent: '95%',
  },
  {
    noteNumber: 3,
    noteName: 'E4',
    solfege: 'MI',
    frequency: 329.63,
    color: '#EAB308',
    activeColor: '#FDE047',
    widthPercent: '90%',
  },
  {
    noteNumber: 4,
    noteName: 'F4',
    solfege: 'FA',
    frequency: 349.23,
    color: '#22C55E',
    activeColor: '#86EFAC',
    widthPercent: '85%',
  },
  {
    noteNumber: 5,
    noteName: 'G4',
    solfege: 'SOL',
    frequency: 392.0,
    color: '#06B6D4',
    activeColor: '#67E8F9',
    widthPercent: '80%',
  },
  {
    noteNumber: 6,
    noteName: 'A4',
    solfege: 'LA',
    frequency: 440.0,
    color: '#3B82F6',
    activeColor: '#93C5FD',
    widthPercent: '75%',
  },
  {
    noteNumber: 7,
    noteName: 'B4',
    solfege: 'SI',
    frequency: 493.88,
    color: '#A855F7',
    activeColor: '#D8B4FE',
    widthPercent: '70%',
  },
];

// Demo song: Twinkle Twinkle (indices 0-based: 0=C, 0=C, 4=G, 4=G, 5=A, 5=A, 4=G, ...)
const DEMO_SONG = [0, 0, 4, 4, 5, 5, 4, 3, 3, 2, 2, 1, 1, 0];

export default function XylophoneScreen() {
  const [activeNote, setActiveNote] = useState<number | null>(null);
  const [isPlayingDemo, setIsPlayingDemo] = useState(false);
  const [playedCount, setPlayedCount] = useState(0);

  // Audio Context for Web/Browser & Simulator sound synthesis
  const audioCtxRef = useRef<any>(null);

  const getAudioContext = () => {
    if (typeof window !== 'undefined') {
      const AudioCtxClass =
        (window as any).AudioContext || (window as any).webkitAudioContext;
      if (AudioCtxClass) {
        if (!audioCtxRef.current) {
          audioCtxRef.current = new AudioCtxClass();
        }
        if (audioCtxRef.current.state === 'suspended') {
          audioCtxRef.current.resume();
        }
        return audioCtxRef.current;
      }
    }
    return null;
  };

  const playTone = (frequency: number) => {
    try {
      const ctx = getAudioContext();
      if (ctx) {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        // Xylophone timbre: Sine + slight decay
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(frequency, ctx.currentTime);

        gain.gain.setValueAtTime(0.7, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.8);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start();
        osc.stop(ctx.currentTime + 0.8);
      }
    } catch (e) {
      console.log('Audio playback error', e);
    }
  };

  const handleKeyPress = (key: XyloKey) => {
    setActiveNote(key.noteNumber);
    playTone(key.frequency);
    setPlayedCount((c) => c + 1);

    setTimeout(() => {
      setActiveNote((curr) => (curr === key.noteNumber ? null : curr));
    }, 250);
  };

  const playDemoSong = async () => {
    if (isPlayingDemo) return;
    setIsPlayingDemo(true);

    for (let i = 0; i < DEMO_SONG.length; i++) {
      const keyIndex = DEMO_SONG[i];
      const key = XYLOPHONE_KEYS[keyIndex];
      handleKeyPress(key);
      await new Promise((resolve) => setTimeout(resolve, 450));
    }

    setIsPlayingDemo(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>LAB 5 • PACKAGES & AUDIO</Text>
        </View>
        <Text style={styles.title}>Xylophone</Text>
        <Text style={styles.subtitle}>Tap the keys to play music</Text>
      </View>

      {/* Xylophone Instrument Keys */}
      <View style={styles.xylophoneFrame}>
        {/* Wooden frame rails */}
        <View style={styles.leftRail} />
        <View style={styles.rightRail} />

        {/* Sound Bars */}
        <View style={styles.barsContainer}>
          {XYLOPHONE_KEYS.map((key) => {
            const isActive = activeNote === key.noteNumber;
            return (
              <View
                key={key.noteNumber}
                style={[
                  styles.barWrapper,
                  { width: key.widthPercent as any },
                ]}>
                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={() => handleKeyPress(key)}
                  style={[
                    styles.keyBar,
                    {
                      backgroundColor: isActive ? key.activeColor : key.color,
                      transform: [{ scale: isActive ? 0.97 : 1 }],
                    },
                  ]}>
                  {/* Screws / Pins on bar */}
                  <View style={styles.pin} />
                  <View style={styles.keyLabel}>
                    <Text style={styles.noteName}>{key.noteName}</Text>
                    <Text style={styles.solfegeName}>{key.solfege}</Text>
                  </View>
                  <View style={styles.pin} />
                </TouchableOpacity>
              </View>
            );
          })}
        </View>
      </View>

      {/* Footer Controls */}
      <View style={styles.footerSection}>
        <TouchableOpacity
          activeOpacity={0.8}
          style={[styles.demoButton, isPlayingDemo && styles.demoButtonActive]}
          onPress={playDemoSong}
          disabled={isPlayingDemo}>
          <Text style={styles.demoButtonText}>
            {isPlayingDemo
              ? '🎵 PLAYING "TWINKLE TWINKLE"...'
              : '🎼 AUTO-PLAY DEMO MELODY'}
          </Text>
        </TouchableOpacity>

        <View style={styles.infoCard}>
          <Text style={styles.infoText}>
            Notes Played: <Text style={styles.infoHighlight}>{playedCount}</Text>
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F172A',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  header: {
    alignItems: 'center',
    marginBottom: 8,
  },
  badge: {
    backgroundColor: 'rgba(239, 68, 68, 0.2)',
    paddingHorizontal: 14,
    paddingVertical: 4,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#EF4444',
    marginBottom: 6,
  },
  badgeText: {
    color: '#FCA5A5',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.5,
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 1,
  },
  subtitle: {
    fontSize: 13,
    color: '#94A3B8',
    marginTop: 2,
  },
  xylophoneFrame: {
    flex: 1,
    marginVertical: 12,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    maxHeight: 480,
  },
  leftRail: {
    position: 'absolute',
    left: '12%',
    top: 10,
    bottom: 10,
    width: 14,
    backgroundColor: '#78350F',
    borderRadius: 7,
    borderWidth: 1,
    borderColor: '#92400E',
    zIndex: 0,
  },
  rightRail: {
    position: 'absolute',
    right: '12%',
    top: 10,
    bottom: 10,
    width: 14,
    backgroundColor: '#78350F',
    borderRadius: 7,
    borderWidth: 1,
    borderColor: '#92400E',
    zIndex: 0,
  },
  barsContainer: {
    width: '100%',
    height: '100%',
    justifyContent: 'space-around',
    alignItems: 'center',
    zIndex: 1,
  },
  barWrapper: {
    height: '12%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  keyBar: {
    width: '100%',
    height: '100%',
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    shadowColor: '#000',
    shadowOpacity: 0.35,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 4,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  pin: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#334155',
    borderWidth: 2,
    borderColor: '#CBD5E1',
  },
  keyLabel: {
    alignItems: 'center',
  },
  noteName: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '900',
    letterSpacing: 1,
  },
  solfegeName: {
    color: 'rgba(255, 255, 255, 0.85)',
    fontSize: 10,
    fontWeight: '700',
  },
  footerSection: {
    width: '100%',
    maxWidth: 380,
    alignSelf: 'center',
    gap: 8,
  },
  demoButton: {
    backgroundColor: '#2563EB',
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
    shadowColor: '#2563EB',
    shadowOpacity: 0.4,
    shadowRadius: 8,
  },
  demoButtonActive: {
    backgroundColor: '#7C3AED',
  },
  demoButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
    letterSpacing: 1,
  },
  infoCard: {
    backgroundColor: '#1E293B',
    paddingVertical: 8,
    borderRadius: 10,
    alignItems: 'center',
  },
  infoText: {
    color: '#94A3B8',
    fontSize: 12,
  },
  infoHighlight: {
    color: '#38BDF8',
    fontWeight: '700',
  },
});
