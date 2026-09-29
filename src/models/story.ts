export interface StoryNode {
  id: number;
  storyTitle: string;
  choice1: string;
  choice2: string;
  choice1Destination: number;
  choice2Destination: number;
  isEnd: boolean;
  emoji?: string;
}
