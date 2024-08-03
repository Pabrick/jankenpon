export type PlayerState = 'name' | 'wait' | 'choice' | 'timer' | 'result';
export type PlayerChoice = 'rock' | 'paper' | 'scissors';
export type PlayerResult = 'win' | 'lose' | 'tie';
export type PlayerType = 'local' | 'remote' | 'computer';

export interface PlayerEmitter {
  state: PlayerState;
  extra: PlayerScoreboard | PlayerChoice;
}

export interface PlayerOutcome {
  choice: PlayerChoice;
  result: PlayerResult;
}

export interface PlayerScoreboard {
  name: string;
  score: number;
}

export type Player = {
  number?: number;
  type?: PlayerType;
  name?: string;
  score?: number;
  choice?: PlayerChoice;
  result?: PlayerResult;
  state?: PlayerState;
};
