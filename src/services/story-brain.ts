import { StoryNode } from '../models/story';

export class StoryBrain {
  private _storyNumber: number = 0;

  private _storyData: StoryNode[] = [
    {
      id: 0,
      storyTitle:
        'Your car has blown a tire on a winding road in the middle of nowhere with no cell reception. You decide to hitchhike. A rusty pickup truck rumbles to a stop next to you. A man with a wide brimmed hat and soulless eyes opens the passenger door for you and asks: "Need a ride, buddy?"',
      choice1: "I'll hop in. Thanks for the help!",
      choice2: "Better ask him if he's a murderer first.",
      choice1Destination: 2,
      choice2Destination: 1,
      isEnd: false,
      emoji: '🚗💨',
    },
    {
      id: 1,
      storyTitle: 'He nods slowly, completely unfazed by your question.',
      choice1: "At least he's honest. I'll climb in.",
      choice2: 'Wait, I know how to change a tire myself!',
      choice1Destination: 2,
      choice2Destination: 3,
      isEnd: false,
      emoji: '👀',
    },
    {
      id: 2,
      storyTitle:
        'As you begin to drive, the stranger starts talking about his turbulent relationship with his mother. He gets angrier by the minute. He asks you to open the glovebox. Inside you find a bloody knife, two severed fingers, and a cassette tape of Elton John. He reaches over...',
      choice1: 'I love Elton John! Hand him the cassette tape.',
      choice2: "It's him or me! Grab the knife and fight back.",
      choice1Destination: 5,
      choice2Destination: 4,
      isEnd: false,
      emoji: '🔪📻',
    },
    {
      id: 3,
      storyTitle:
        'What a smart move! You successfully replace the spare tire, avoid any suspicious strangers, and safely reach your destination without incident.',
      choice1: '',
      choice2: '',
      choice1Destination: 0,
      choice2Destination: 0,
      isEnd: true,
      emoji: '🎉🛠️',
    },
    {
      id: 4,
      storyTitle:
        'As you smash through the guardrail and careen towards the jagged canyon rocks below, you reflect on the dubious wisdom of stabbing someone while they are driving the car you are inside.',
      choice1: '',
      choice2: '',
      choice1Destination: 0,
      choice2Destination: 0,
      isEnd: true,
      emoji: '💥💀',
    },
    {
      id: 5,
      storyTitle:
        'You bond with the mysterious driver while crooning verses of "Can You Feel the Love Tonight". Moved to tears, he drops you off safely at the next town and gives you a five-star hitchhiker review.',
      choice1: '',
      choice2: '',
      choice1Destination: 0,
      choice2Destination: 0,
      isEnd: true,
      emoji: '🌟🎶',
    },
  ];

  public getStory(): StoryNode {
    return this._storyData[this._storyNumber];
  }

  public nextStory(choiceNumber: 1 | 2): void {
    const current = this._storyData[this._storyNumber];
    if (choiceNumber === 1) {
      this._storyNumber = current.choice1Destination;
    } else {
      this._storyNumber = current.choice2Destination;
    }
  }

  public isFinished(): boolean {
    return this._storyData[this._storyNumber].isEnd;
  }

  public restart(): void {
    this._storyNumber = 0;
  }
}
