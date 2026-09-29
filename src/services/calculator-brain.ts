export interface BMIResult {
  bmi: string;
  result: string;
  interpretation: string;
  color: string;
}

export class CalculatorBrain {
  private height: number; // in cm
  private weight: number; // in kg
  private _bmi: number = 0;

  constructor(height: number, weight: number) {
    this.height = height;
    this.weight = weight;
  }

  public calculateBMI(): BMIResult {
    const heightInMeters = this.height / 100;
    this._bmi = this.weight / (heightInMeters * heightInMeters);
    const bmiString = this._bmi.toFixed(1);

    if (this._bmi >= 30) {
      return {
        bmi: bmiString,
        result: 'OBESE',
        interpretation:
          'Your BMI is higher than the recommended range. Please consult a healthcare professional for a balanced wellness plan.',
        color: '#EF4444',
      };
    } else if (this._bmi >= 25) {
      return {
        bmi: bmiString,
        result: 'OVERWEIGHT',
        interpretation:
          'You have a higher than normal body weight. Try to exercise more and adopt balanced nutritional habits.',
        color: '#F59E0B',
      };
    } else if (this._bmi >= 18.5) {
      return {
        bmi: bmiString,
        result: 'NORMAL',
        interpretation:
          'You have a normal and healthy body weight. Keep up the excellent work!',
        color: '#10B981',
      };
    } else {
      return {
        bmi: bmiString,
        result: 'UNDERWEIGHT',
        interpretation:
          'You have a lower than normal body weight. You should focus on nourishing, calorie-dense foods.',
        color: '#3B82F6',
      };
    }
  }
}
