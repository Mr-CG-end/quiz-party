export interface Character {
  id: string | number;
  name: string;
  image: string;
  summary: string;
  minimumScore: number;
}

export interface QuizItem {
  id: number;
  title: string;
}

export interface Quiz {
  id: number;
  title: string;
  items: QuizItem[];
  currectAnswer: number;
  response: {
    win: string;
    lose: string;
  };
}

export interface LeaderboardItem {
  image: string;
  name: string;
  score: number;
}
