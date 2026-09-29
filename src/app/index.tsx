import React, { useState, useRef } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Animated,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { StoryBrain } from '../services/story-brain';

const { width } = Dimensions.get('window');

export default function DestiniScreen() {
  const storyBrainRef = useRef(new StoryBrain());
  const storyBrain = storyBrainRef.current;

  const [currentStory, setCurrentStory] = useState(storyBrain.getStory());
  const [fadeAnim] = useState(new Animated.Value(1));

  const transitionToStory = (callback: () => void) => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 150,
      useNativeDriver: true,
    }).start(() => {
      callback();
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 250,
        useNativeDriver: true,
      }).start();
    });
  };

  const handleChoice = (choiceNumber: 1 | 2) => {
    transitionToStory(() => {
      storyBrain.nextStory(choiceNumber);
      setCurrentStory(storyBrain.getStory());
    });
  };

  const handleRestart = () => {
    transitionToStory(() => {
      storyBrain.restart();
      setCurrentStory(storyBrain.getStory());
    });
  };

  const isEnding = currentStory.isEnd;

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>LAB 7 • BOSS CHALLENGE 2</Text>
        </View>
        <Text style={styles.title}>Destini</Text>
        <Text style={styles.subtitle}>Choose Your Own Interactive Adventure</Text>
      </View>

      {/* Story Content Area */}
      <Animated.View style={[styles.storyCard, { opacity: fadeAnim }]}>
        <ScrollView
          contentContainerStyle={styles.storyScroll}
          showsVerticalScrollIndicator={false}>
          {currentStory.emoji && (
            <Text style={styles.storyEmoji}>{currentStory.emoji}</Text>
          )}
          <Text style={styles.storyText}>{currentStory.storyTitle}</Text>
        </ScrollView>
      </Animated.View>

      {/* Action / Choice Buttons */}
      <View style={styles.buttonContainer}>
        {!isEnding ? (
          <>
            <TouchableOpacity
              activeOpacity={0.8}
              style={styles.choice1Button}
              onPress={() => handleChoice(1)}>
              <Text style={styles.choice1Text}>
                {currentStory.choice1}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.8}
              style={styles.choice2Button}
              onPress={() => handleChoice(2)}>
              <Text style={styles.choice2Text}>
                {currentStory.choice2}
              </Text>
            </TouchableOpacity>
          </>
        ) : (
          <TouchableOpacity
            activeOpacity={0.8}
            style={styles.restartButton}
            onPress={handleRestart}>
            <Text style={styles.restartButtonText}>🔄 PLAY AGAIN</Text>
          </TouchableOpacity>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F172A',
    justifyContent: 'space-between',
    paddingVertical: 18,
    paddingHorizontal: 20,
  },
  header: {
    alignItems: 'center',
    marginTop: 6,
  },
  badge: {
    backgroundColor: 'rgba(239, 68, 68, 0.2)',
    paddingHorizontal: 14,
    paddingVertical: 5,
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
    fontSize: 34,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 1.5,
  },
  subtitle: {
    fontSize: 13,
    color: '#94A3B8',
    marginTop: 4,
  },
  storyCard: {
    flex: 1,
    backgroundColor: '#1E293B',
    borderRadius: 20,
    marginVertical: 16,
    padding: 24,
    borderWidth: 1,
    borderColor: '#334155',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    justifyContent: 'center',
  },
  storyScroll: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  storyEmoji: {
    fontSize: 48,
    marginBottom: 16,
    textAlign: 'center',
  },
  storyText: {
    color: '#F8FAFC',
    fontSize: 18,
    lineHeight: 28,
    textAlign: 'center',
    fontWeight: '500',
  },
  buttonContainer: {
    width: '100%',
    maxWidth: 380,
    gap: 12,
    alignSelf: 'center',
  },
  choice1Button: {
    backgroundColor: '#DC2626', // Red choice button
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#DC2626',
    shadowOpacity: 0.4,
    shadowRadius: 8,
  },
  choice1Text: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
    textAlign: 'center',
    lineHeight: 20,
  },
  choice2Button: {
    backgroundColor: '#2563EB', // Blue choice button
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#2563EB',
    shadowOpacity: 0.4,
    shadowRadius: 8,
  },
  choice2Text: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
    textAlign: 'center',
    lineHeight: 20,
  },
  restartButton: {
    backgroundColor: '#10B981', // Emerald green restart
    paddingVertical: 18,
    borderRadius: 14,
    alignItems: 'center',
    shadowColor: '#10B981',
    shadowOpacity: 0.4,
    shadowRadius: 8,
  },
  restartButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: 1.5,
  },
});
