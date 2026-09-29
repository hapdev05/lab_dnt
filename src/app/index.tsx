import React, { useState, useRef } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  Animated,
  Dimensions,
  Keyboard,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';

const { width } = Dimensions.get('window');

const ANSWERS = [
  // Affirmative
  'It is certain',
  'Without a doubt',
  'You may rely on it',
  'Yes, definitely',
  'Most likely',
  'Signs point to yes',
  // Non-committal
  'Reply hazy, try again',
  'Ask again later',
  'Better not tell you now',
  'Cannot predict now',
  'Concentrate and ask again',
  // Negative
  "Don't count on it",
  'My reply is no',
  'My sources say no',
  'Outlook not so good',
  'Very doubtful',
];

export default function Magic8BallScreen() {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState<string | null>(null);
  const [isShaking, setIsShaking] = useState(false);
  const [askCount, setAskCount] = useState(0);

  const shakeAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(1)).current;

  const askThe8Ball = () => {
    if (isShaking) return;
    Keyboard.dismiss();
    setIsShaking(true);

    // Shake sequence
    Animated.sequence([
      Animated.timing(shakeAnim, {
        toValue: 15,
        duration: 60,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnim, {
        toValue: -15,
        duration: 60,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnim, {
        toValue: 12,
        duration: 60,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnim, {
        toValue: -12,
        duration: 60,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnim, {
        toValue: 8,
        duration: 60,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnim, {
        toValue: 0,
        duration: 60,
        useNativeDriver: true,
      }),
    ]).start(() => {
      const randomIndex = Math.floor(Math.random() * ANSWERS.length);
      setAnswer(ANSWERS[randomIndex]);
      setAskCount((c) => c + 1);
      setIsShaking(false);

      // Fade in answer
      fadeAnim.setValue(0);
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 350,
        useNativeDriver: true,
      }).start();
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>LAB 4 • CHALLENGE 1</Text>
        </View>
        <Text style={styles.title}>Magic 8 Ball</Text>
        <Text style={styles.subtitle}>Ask a question and seek your destiny</Text>
      </View>

      {/* Question Input */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Type your yes/no question here..."
          placeholderTextColor="#818CF8"
          value={question}
          onChangeText={setQuestion}
          onSubmitEditing={askThe8Ball}
          returnKeyType="go"
        />
      </View>

      {/* Magic 8 Ball */}
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={askThe8Ball}
        style={styles.ballWrapper}>
        <Animated.View
          style={[
            styles.ballOuter,
            {
              transform: [{ translateX: shakeAnim }],
            },
          ]}>
          {/* Ball Shine Highlight */}
          <View style={styles.ballHighlight} />

          {/* Inner Display Window */}
          <View style={styles.innerWindow}>
            {answer ? (
              <Animated.View
                style={[styles.triangleContainer, { opacity: fadeAnim }]}>
                <View style={styles.triangle} />
                <Text style={styles.answerText}>{answer}</Text>
              </Animated.View>
            ) : (
              <View style={styles.eightLogo}>
                <Text style={styles.eightText}>8</Text>
              </View>
            )}
          </View>
        </Animated.View>
      </TouchableOpacity>

      {/* Action Button & Footer */}
      <View style={styles.bottomSection}>
        <TouchableOpacity
          activeOpacity={0.8}
          style={[styles.askButton, isShaking && styles.askButtonDisabled]}
          onPress={askThe8Ball}
          disabled={isShaking}>
          <Text style={styles.askButtonText}>
            {isShaking ? '✨ CONSULTING THE ORACLE...' : '🔮 ASK THE 8 BALL'}
          </Text>
        </TouchableOpacity>

        <View style={styles.statsCard}>
          <Text style={styles.statsText}>
            Questions Asked: <Text style={styles.statsCount}>{askCount}</Text>
          </Text>
          <Text style={styles.hintText}>
            Tip: Ask clear questions that can be answered with yes or no
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F172A', // Cosmic deep slate/indigo
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 20,
    paddingHorizontal: 20,
  },
  header: {
    alignItems: 'center',
    marginTop: 8,
  },
  badge: {
    backgroundColor: 'rgba(99, 102, 241, 0.2)',
    paddingHorizontal: 14,
    paddingVertical: 5,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#6366F1',
    marginBottom: 8,
  },
  badgeText: {
    color: '#A5B4FC',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.5,
  },
  title: {
    fontSize: 34,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 1.2,
  },
  subtitle: {
    fontSize: 13,
    color: '#94A3B8',
    marginTop: 4,
  },
  inputContainer: {
    width: '100%',
    maxWidth: 360,
    marginTop: 8,
  },
  input: {
    backgroundColor: '#1E293B',
    borderRadius: 14,
    paddingVertical: 12,
    paddingHorizontal: 16,
    color: '#F8FAFC',
    fontSize: 14,
    borderWidth: 1,
    borderColor: '#334155',
    textAlign: 'center',
  },
  ballWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 10,
  },
  ballOuter: {
    width: Math.min(width * 0.72, 270),
    height: Math.min(width * 0.72, 270),
    borderRadius: Math.min(width * 0.72, 270) / 2,
    backgroundColor: '#05070B',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#6366F1',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.4,
    shadowRadius: 20,
    elevation: 12,
    borderWidth: 2,
    borderColor: '#1E293B',
    position: 'relative',
  },
  ballHighlight: {
    position: 'absolute',
    top: 25,
    left: 45,
    width: 60,
    height: 35,
    borderRadius: 30,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    transform: [{ rotate: '-35deg' }],
  },
  innerWindow: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: '#0F172A',
    borderWidth: 4,
    borderColor: '#1E293B',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  eightLogo: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  eightText: {
    fontSize: 54,
    fontWeight: '900',
    color: '#05070B',
  },
  triangleContainer: {
    width: 130,
    height: 130,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1E1B4B',
    borderRadius: 65,
    padding: 12,
    borderWidth: 2,
    borderColor: '#4338CA',
  },
  triangle: {
    position: 'absolute',
    width: 0,
    height: 0,
    borderLeftWidth: 55,
    borderRightWidth: 55,
    borderBottomWidth: 95,
    borderStyle: 'solid',
    backgroundColor: 'transparent',
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: '#312E81',
    transform: [{ rotate: '180deg' }],
  },
  answerText: {
    color: '#E0E7FF',
    fontSize: 13,
    fontWeight: '800',
    textAlign: 'center',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    lineHeight: 18,
    zIndex: 2,
  },
  bottomSection: {
    width: '100%',
    maxWidth: 380,
    gap: 12,
  },
  askButton: {
    backgroundColor: '#6366F1',
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: '#6366F1',
    shadowOpacity: 0.5,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
  },
  askButtonDisabled: {
    opacity: 0.6,
  },
  askButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: 1.2,
  },
  statsCard: {
    alignItems: 'center',
    backgroundColor: '#1E293B',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#334155',
  },
  statsText: {
    color: '#94A3B8',
    fontSize: 12,
    fontWeight: '600',
  },
  statsCount: {
    color: '#A5B4FC',
    fontWeight: '800',
  },
  hintText: {
    color: '#64748B',
    fontSize: 11,
    marginTop: 4,
    textAlign: 'center',
  },
});
