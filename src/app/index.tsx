import React, { useState, useRef } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Alert,
  ScrollView,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { QuizBrain } from '../services/quiz-brain';

const { width } = Dimensions.get('window');

export default function QuizzlerScreen() {
  const quizBrainRef = useRef(new QuizBrain());
  const quizBrain = quizBrainRef.current;

  const [questionText, setQuestionText] = useState(quizBrain.getQuestionText());
  const [questionNumber, setQuestionNumber] = useState(quizBrain.getQuestionNumber());
  const [totalQuestions] = useState(quizBrain.getTotalQuestions());
  const [scoreIcons, setScoreIcons] = useState<string[]>([]);
  const [correctCount, setCorrectCount] = useState(0);
  const [isQuizCompleted, setIsQuizCompleted] = useState(false);

  const checkAnswer = (userPickedAnswer: boolean) => {
    if (isQuizCompleted) return;

    const correctAnswer = quizBrain.getCorrectAnswer();
    const isCorrect = userPickedAnswer === correctAnswer;

    const newScoreIcons = [...scoreIcons, isCorrect ? '✅' : '❌'];
    const newCorrectCount = isCorrect ? correctCount + 1 : correctCount;

    setScoreIcons(newScoreIcons);
    if (isCorrect) setCorrectCount(newCorrectCount);

    if (quizBrain.isFinished()) {
      setIsQuizCompleted(true);
      Alert.alert(
        'Quiz Finished! 🏆',
        `You answered ${newCorrectCount} out of ${totalQuestions} questions correctly!`,
        [{ text: 'Restart Quiz', onPress: restartQuiz }]
      );
    } else {
      quizBrain.nextQuestion();
      setQuestionText(quizBrain.getQuestionText());
      setQuestionNumber(quizBrain.getQuestionNumber());
    }
  };

  const restartQuiz = () => {
    quizBrain.reset();
    setQuestionText(quizBrain.getQuestionText());
    setQuestionNumber(quizBrain.getQuestionNumber());
    setScoreIcons([]);
    setCorrectCount(0);
    setIsQuizCompleted(false);
  };

  const progress = questionNumber / totalQuestions;

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>LAB 6 • MODULAR ARCHITECTURE</Text>
        </View>
        <Text style={styles.title}>Quizzler</Text>

        {/* Progress bar */}
        <View style={styles.progressBarContainer}>
          <View
            style={[
              styles.progressBarFill,
              { width: `${Math.round(progress * 100)}%` },
            ]}
          />
        </View>
        <Text style={styles.progressText}>
          Question {questionNumber} of {totalQuestions}
        </Text>
      </View>

      {/* Question Card Display */}
      <View style={styles.questionCard}>
        <Text style={styles.questionNumberBadge}>Q{questionNumber}</Text>
        <Text style={styles.questionText}>{questionText}</Text>
      </View>

      {/* Action Buttons: True / False */}
      <View style={styles.buttonSection}>
        <TouchableOpacity
          activeOpacity={0.8}
          style={styles.trueButton}
          onPress={() => checkAnswer(true)}
          disabled={isQuizCompleted}>
          <Text style={styles.buttonText}>✓ TRUE</Text>
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.8}
          style={styles.falseButton}
          onPress={() => checkAnswer(false)}
          disabled={isQuizCompleted}>
          <Text style={styles.buttonText}>✕ FALSE</Text>
        </TouchableOpacity>

        {/* Score Keeper History */}
        <View style={styles.scoreKeeperContainer}>
          <Text style={styles.scoreKeeperTitle}>Score Tracker:</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.scoreIconsRow}>
            {scoreIcons.length === 0 ? (
              <Text style={styles.emptyScoreText}>Your answers will appear here</Text>
            ) : (
              scoreIcons.map((icon, index) => (
                <Text key={index} style={styles.scoreIcon}>
                  {icon}
                </Text>
              ))
            )}
          </ScrollView>
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
    paddingVertical: 18,
    paddingHorizontal: 20,
  },
  header: {
    alignItems: 'center',
    marginTop: 6,
  },
  badge: {
    backgroundColor: 'rgba(59, 130, 246, 0.2)',
    paddingHorizontal: 14,
    paddingVertical: 5,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#3B82F6',
    marginBottom: 6,
  },
  badgeText: {
    color: '#93C5FD',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.5,
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 1,
    marginBottom: 12,
  },
  progressBarContainer: {
    width: '100%',
    maxWidth: 360,
    height: 8,
    backgroundColor: '#1E293B',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#3B82F6',
    borderRadius: 4,
  },
  progressText: {
    color: '#94A3B8',
    fontSize: 12,
    fontWeight: '600',
    marginTop: 6,
  },
  questionCard: {
    flex: 1,
    backgroundColor: '#1E293B',
    borderRadius: 20,
    marginVertical: 20,
    padding: 24,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#334155',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    position: 'relative',
  },
  questionNumberBadge: {
    position: 'absolute',
    top: 16,
    left: 18,
    color: '#64748B',
    fontSize: 14,
    fontWeight: '800',
  },
  questionText: {
    fontSize: 22,
    fontWeight: '700',
    color: '#F8FAFC',
    textAlign: 'center',
    lineHeight: 32,
  },
  buttonSection: {
    width: '100%',
    maxWidth: 380,
    gap: 12,
    alignSelf: 'center',
  },
  trueButton: {
    backgroundColor: '#16A34A', // Green
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: 'center',
    shadowColor: '#16A34A',
    shadowOpacity: 0.4,
    shadowRadius: 8,
  },
  falseButton: {
    backgroundColor: '#DC2626', // Red
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: 'center',
    shadowColor: '#DC2626',
    shadowOpacity: 0.4,
    shadowRadius: 8,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: 1.5,
  },
  scoreKeeperContainer: {
    backgroundColor: '#1E293B',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#334155',
    marginTop: 4,
  },
  scoreKeeperTitle: {
    color: '#94A3B8',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.8,
    marginBottom: 6,
  },
  scoreIconsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 28,
    gap: 6,
  },
  emptyScoreText: {
    color: '#64748B',
    fontSize: 12,
    fontStyle: 'italic',
  },
  scoreIcon: {
    fontSize: 16,
  },
});
