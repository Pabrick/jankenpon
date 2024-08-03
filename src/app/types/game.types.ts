import { PlayerState } from './player.types';

export type GameStep = 'name' | 'choice' | 'result';

export interface GameState {
  player1State: PlayerState;
  player2State: PlayerState;
}
