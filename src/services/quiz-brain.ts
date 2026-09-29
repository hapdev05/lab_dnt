import { Question } from '../models/question';

export class QuizBrain {
  private _questionNumber: number = 0;

  private _questionBank: Question[] = [
    {
      questionText: 'Some cats are actually allergic to humans.',
      questionAnswer: true,
      explanation: 'Cats can indeed develop allergies to human dander and perfumes!',
    },
    {
      questionText: 'You can lead a cow down stairs but not up stairs.',
      questionAnswer: false,
      explanation: 'Cows can walk upstairs, but their knees cannot easily bend to walk downstairs.',
    },
    {
      questionText: 'Approximately one quarter of human bones are in the feet.',
      questionAnswer: true,
      explanation: 'Each foot has 26 bones, totaling 52 bones out of 206 in the adult body.',
    },
    {
      questionText: "A slug's blood is green.",
      questionAnswer: true,
      explanation: 'Slug blood contains hemocyanin which turns green/blue when oxygenated.',
    },
    {
      questionText: "Buzz Aldrin's mother's maiden name was 'Moon'.",
      questionAnswer: true,
      explanation: 'Marion Moon was indeed the mother of Apollo 11 astronaut Buzz Aldrin.',
    },
    {
      questionText: 'It is illegal to pee in the Ocean in Portugal.',
      questionAnswer: true,
      explanation: 'It is an official environmental law in Portugal!',
    },
    {
      questionText: 'Google was originally called "Backrub".',
      questionAnswer: true,
      explanation: 'Larry Page and Sergey Brin originally called their search engine Backrub in 1996.',
    },
    {
      questionText: 'The loudest sound produced by any animal is 188 decibels by the African Elephant.',
      questionAnswer: false,
      explanation: 'It is actually the Blue Whale, producing sounds up to 188 dB underwater.',
    },
    {
      questionText: 'The total surface area of two human lungs is approximately 70 square metres.',
      questionAnswer: true,
      explanation: 'Roughly the size of a standard tennis court!',
    },
    {
      questionText: 'Chocolate affects a dog’s heart and nervous system; a few ounces can be toxic.',
      questionAnswer: true,
      explanation: 'Theobromine in chocolate is toxic to dogs and cannot be easily metabolized.',
    },
  ];

  public getQuestionText(): string {
    return this._questionBank[this._questionNumber].questionText;
  }

  public getCorrectAnswer(): boolean {
    return this._questionBank[this._questionNumber].questionAnswer;
  }

  public getExplanation(): string | undefined {
    return this._questionBank[this._questionNumber].explanation;
  }

  public getQuestionNumber(): number {
    return this._questionNumber + 1;
  }

  public getTotalQuestions(): number {
    return this._questionBank.length;
  }

  public getProgress(): number {
    return (this._questionNumber + 1) / this._questionBank.length;
  }

  public nextQuestion(): void {
    if (this._questionNumber < this._questionBank.length - 1) {
      this._questionNumber++;
    }
  }

  public isFinished(): boolean {
    return this._questionNumber >= this._questionBank.length - 1;
  }

  public reset(): void {
    this._questionNumber = 0;
  }
}
