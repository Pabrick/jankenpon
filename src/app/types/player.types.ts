import { GameChoice } from './game.types';

export type PlayerState = 'name' | 'wait' | 'choice' | 'timer' | 'result';

export type PlayerResult = 'win' | 'lose' | 'tie';
export type PlayerType = 'local' | 'remote' | 'computer';

export interface PlayerEmitter {
  state: PlayerState;
  extra: PlayerScoreboard;
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
  choice?: GameChoice;
  result?: PlayerResult;
  state?: PlayerState;
};
