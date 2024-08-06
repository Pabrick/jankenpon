import { Injectable } from '@angular/core';
import {
  Player,
  PlayerResult,
  PlayerState,
  PlayerType,
} from '../../types/player.types';
import { BehaviorSubject } from 'rxjs';
import { StorageService } from '../storage/storage.service';
import { choices } from '../../const/choices';
import { Choice, GameChoice } from '../../types/game.types';

@Injectable({
  providedIn: 'root',
})
export class GameService {
  gameBoardSub = new BehaviorSubject<Player[] | undefined>(undefined);
  gameBoard$ = this.gameBoardSub.asObservable();
  gameBoard!: Player[];
  playerAssigned = 0;

  constructor(private storageSrv: StorageService) {}

  updateGameBoard() {
    console.log('Update Game', this.gameBoard);
    this.gameBoardSub.next(this.gameBoard);
  }

  newGame(playerCapacity: number, type: PlayerType) {
    this.gameBoard = new Array(playerCapacity);

    for (let i = 0; i < this.gameBoard.length; i++) {
      this.gameBoard[i] = {
        number: i + 1, // This number will be chosen by the WS
        type: type === 'computer' && i === 0 ? 'local' : type,
        score: 0,
        state: 'wait',
      };
    }

    this.playerAssigned = 0;
    this.updateGameBoard();
  }

  newRound() {
    for (let i = 0; i < this.gameBoard.length; i++) {
      const currentPlayer = this.gameBoard[i];
      this.gameBoard[i] = {
        ...currentPlayer,
        state: 'wait',
        choice: undefined,
        result: undefined,
      };
    }
    this.updateGameBoard();
  }

  setPlayerState(playerNumber: number, playerState: PlayerState) {
    this.gameBoard[playerNumber].state = playerState;
    this.updateGameBoard();
  }

  setPlayerName(playerNumber: number, playerName?: string) {
    const name = (
      (playerName ?? this.gameBoard[playerNumber].name) as string
    ).toLocaleLowerCase();
    const player = this.storageSrv.getPlayer(name);
    this.gameBoard[playerNumber].name = name;
    this.gameBoard[playerNumber].score = player?.score ?? 0;
    this.gameBoard[playerNumber].state = 'wait';
    this.updateGameBoard();
  }

  setPlayerChoice(playerNumber: number, playerChoice: GameChoice) {
    this.gameBoard[playerNumber].choice = playerChoice;
    this.gameBoard[playerNumber].state = 'wait';
    this.updateGameBoard();
  }

  updatePlayerScore(playerNumber: number, score: number) {
    const prevScore = this.gameBoard[playerNumber].score as number;
    this.gameBoard[playerNumber].score = prevScore + score;
    this.gameBoard[playerNumber].state = 'result';

    const player = this.gameBoard[playerNumber];
    const playerName: string = player.name as string;
    const playerScore: number = player.score as number;

    const foundPlayer = this.storageSrv.getPlayer(playerName);
    if (!foundPlayer) {
      this.storageSrv.saveName(playerName);
    }
    this.storageSrv.saveScore(playerName, playerScore);

    this.updateGameBoard();
  }

  // UTILS
  trackPlayers(index: number) {
    return `player${index}`;
  }

  getRandomChoice(): GameChoice {
    const randomIndex = Math.floor(Math.random() * choices.length);
    return choices[randomIndex];
  }

  getResult(gameBoard: Player[], playerIndex: number): PlayerResult {
    let result: PlayerResult = 'lose';
    const choice = gameBoard[playerIndex].choice;

    gameBoard.forEach((player, index) => {
      if (index !== playerIndex) {
        if (choice?.name === player.choice?.name) {
          result = 'tie';
        }
        if (choice?.beats.includes(player.choice?.name as Choice)) {
          result = 'win';
        }
      }
    });
    return result;
  }
}
