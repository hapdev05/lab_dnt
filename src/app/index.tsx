import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { CalculatorBrain, BMIResult } from '../services/calculator-brain';

const { width } = Dimensions.get('window');

export default function BMICalculatorScreen() {
  const [selectedGender, setSelectedGender] = useState<'male' | 'female'>('male');
  const [height, setHeight] = useState(175); // cm
  const [weight, setWeight] = useState(68); // kg
  const [age, setAge] = useState(22);
  const [result, setResult] = useState<BMIResult | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  const handleCalculate = () => {
    const calc = new CalculatorBrain(height, weight);
    const res = calc.calculateBMI();
    setResult(res);
    setModalVisible(true);
  };

  const adjustHeight = (delta: number) => {
    setHeight((prev) => Math.min(230, Math.max(100, prev + delta)));
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />

      {/* App Bar */}
      <View style={styles.header}>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>LAB 8 • INTERMEDIATE UI</Text>
        </View>
        <Text style={styles.title}>BMI CALCULATOR</Text>
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}>
        {/* Gender Selection */}
        <View style={styles.row}>
          <TouchableOpacity
            activeOpacity={0.8}
            style={[
              styles.card,
              styles.genderCard,
              selectedGender === 'male' && styles.activeCard,
            ]}
            onPress={() => setSelectedGender('male')}>
            <Text style={styles.genderIcon}>♂️</Text>
            <Text
              style={[
                styles.cardLabel,
                selectedGender === 'male' && styles.activeCardLabel,
              ]}>
              MALE
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.8}
            style={[
              styles.card,
              styles.genderCard,
              selectedGender === 'female' && styles.activeCard,
            ]}
            onPress={() => setSelectedGender('female')}>
            <Text style={styles.genderIcon}>♀️</Text>
            <Text
              style={[
                styles.cardLabel,
                selectedGender === 'female' && styles.activeCardLabel,
              ]}>
              FEMALE
            </Text>
          </TouchableOpacity>
        </View>

        {/* Height Card */}
        <View style={[styles.card, styles.heightCard]}>
          <Text style={styles.cardLabel}>HEIGHT</Text>
          <View style={styles.numberRow}>
            <Text style={styles.numberLarge}>{height}</Text>
            <Text style={styles.unitText}>cm</Text>
          </View>

          {/* Stepper Buttons for Height */}
          <View style={styles.stepperRow}>
            <TouchableOpacity
              style={styles.stepBtn}
              onPress={() => adjustHeight(-5)}>
              <Text style={styles.stepBtnText}>-5</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.roundButton}
              onPress={() => adjustHeight(-1)}>
              <Text style={styles.roundButtonText}>-</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.roundButton}
              onPress={() => adjustHeight(1)}>
              <Text style={styles.roundButtonText}>+</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.stepBtn}
              onPress={() => adjustHeight(5)}>
              <Text style={styles.stepBtnText}>+5</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Weight & Age Controls */}
        <View style={styles.row}>
          {/* Weight */}
          <View style={[styles.card, styles.halfCard]}>
            <Text style={styles.cardLabel}>WEIGHT</Text>
            <View style={styles.numberRow}>
              <Text style={styles.numberLarge}>{weight}</Text>
              <Text style={styles.unitText}>kg</Text>
            </View>
            <View style={styles.buttonRow}>
              <TouchableOpacity
                style={styles.roundButton}
                onPress={() => setWeight((w) => Math.max(30, w - 1))}>
                <Text style={styles.roundButtonText}>-</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.roundButton}
                onPress={() => setWeight((w) => Math.min(200, w + 1))}>
                <Text style={styles.roundButtonText}>+</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Age */}
          <View style={[styles.card, styles.halfCard]}>
            <Text style={styles.cardLabel}>AGE</Text>
            <View style={styles.numberRow}>
              <Text style={styles.numberLarge}>{age}</Text>
              <Text style={styles.unitText}>yrs</Text>
            </View>
            <View style={styles.buttonRow}>
              <TouchableOpacity
                style={styles.roundButton}
                onPress={() => setAge((a) => Math.max(10, a - 1))}>
                <Text style={styles.roundButtonText}>-</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.roundButton}
                onPress={() => setAge((a) => Math.min(120, a + 1))}>
                <Text style={styles.roundButtonText}>+</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Calculate Button */}
      <TouchableOpacity
        activeOpacity={0.85}
        style={styles.calcButton}
        onPress={handleCalculate}>
        <Text style={styles.calcButtonText}>CALCULATE YOUR BMI</Text>
      </TouchableOpacity>

      {/* Results Modal */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={false}
        onRequestClose={() => setModalVisible(false)}>
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.resultTitle}>Your Result</Text>
          </View>

          {result && (
            <View style={styles.resultCard}>
              <Text style={[styles.resultCategory, { color: result.color }]}>
                {result.result}
              </Text>
              <Text style={styles.resultBMI}>{result.bmi}</Text>
              <View style={styles.rangeBox}>
                <Text style={styles.rangeLabel}>Normal BMI range:</Text>
                <Text style={styles.rangeValue}>18.5 – 24.9 kg/m²</Text>
              </View>
              <Text style={styles.resultInterpretation}>
                {result.interpretation}
              </Text>
            </View>
          )}

          <TouchableOpacity
            activeOpacity={0.85}
            style={styles.reCalcButton}
            onPress={() => setModalVisible(false)}>
            <Text style={styles.calcButtonText}>RE-CALCULATE</Text>
          </TouchableOpacity>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A0E21', // Dark blue-black theme
    justifyContent: 'space-between',
  },
  header: {
    alignItems: 'center',
    paddingVertical: 10,
  },
  badge: {
    backgroundColor: 'rgba(235, 21, 85, 0.2)',
    paddingHorizontal: 14,
    paddingVertical: 4,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#EB1555',
    marginBottom: 6,
  },
  badgeText: {
    color: '#FF6B8B',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.5,
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 1.5,
  },
  content: {
    paddingHorizontal: 16,
    gap: 14,
    paddingBottom: 16,
  },
  row: {
    flexDirection: 'row',
    gap: 14,
  },
  card: {
    backgroundColor: '#111328', // Inactive card color
    borderRadius: 14,
    padding: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  genderCard: {
    flex: 1,
    height: 140,
  },
  activeCard: {
    backgroundColor: '#1D1E33', // Active card color
    borderWidth: 1,
    borderColor: '#EB1555',
  },
  genderIcon: {
    fontSize: 48,
    marginBottom: 8,
  },
  cardLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: '#8D8E98',
    letterSpacing: 1.2,
  },
  activeCardLabel: {
    color: '#FFFFFF',
  },
  heightCard: {
    width: '100%',
    paddingVertical: 20,
    backgroundColor: '#1D1E33',
  },
  numberRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginVertical: 4,
  },
  numberLarge: {
    fontSize: 48,
    fontWeight: '900',
    color: '#FFFFFF',
  },
  unitText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#8D8E98',
    marginLeft: 4,
  },
  stepperRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginTop: 8,
  },
  stepBtn: {
    backgroundColor: '#4C4F5E',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
  },
  stepBtnText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 12,
  },
  halfCard: {
    flex: 1,
    backgroundColor: '#1D1E33',
    paddingVertical: 18,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 14,
    marginTop: 10,
  },
  roundButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#4C4F5E',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  roundButtonText: {
    fontSize: 26,
    fontWeight: '700',
    color: '#FFFFFF',
    lineHeight: 28,
  },
  calcButton: {
    backgroundColor: '#EB1555', // Bottom magenta button
    height: 70,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#EB1555',
    shadowOpacity: 0.4,
    shadowRadius: 10,
  },
  calcButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: 1.5,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#0A0E21',
    justifyContent: 'space-between',
  },
  modalHeader: {
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  resultTitle: {
    fontSize: 34,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 1,
  },
  resultCard: {
    flex: 1,
    backgroundColor: '#1D1E33',
    marginHorizontal: 20,
    marginVertical: 24,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'space-evenly',
    padding: 24,
  },
  resultCategory: {
    fontSize: 20,
    fontWeight: '800',
    letterSpacing: 1.5,
  },
  resultBMI: {
    fontSize: 78,
    fontWeight: '900',
    color: '#FFFFFF',
  },
  rangeBox: {
    alignItems: 'center',
  },
  rangeLabel: {
    fontSize: 13,
    color: '#8D8E98',
    marginBottom: 4,
  },
  rangeValue: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '700',
  },
  resultInterpretation: {
    fontSize: 16,
    color: '#FFFFFF',
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: 12,
  },
  reCalcButton: {
    backgroundColor: '#EB1555',
    height: 70,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
