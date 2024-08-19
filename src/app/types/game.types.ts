import { PlayerState } from './player.types';

export interface GameState {
  player1State: PlayerState;
  player2State: PlayerState;
}

export type Choice = 'rock' | 'paper' | 'scissors';
export interface GameChoice {
  name: Choice;
  beats: Choice[];
  icon: string;
}
