import { Injectable } from '@angular/core';
import {
  Player,
  PlayerResult,
  PlayerState,
  PlayerType,
} from '../../types/player.types';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { StorageService } from '../storage/storage.service';
import { choices } from '../../const/choices';
import { Choice, GameChoice } from '../../types/game.types';
import { WebsocketService } from '../websockets/websocket.service';

@Injectable({
  providedIn: 'root',
})
export class GameService {
  gameBoardSub = new BehaviorSubject<Player[] | undefined>(undefined);
  gameBoard$ = this.gameBoardSub.asObservable();
  gameBoard: Player[] = [];

  socketSubscription!: Subscription;
  playerAssigned$!: Observable<number>;
  indexAssigned = 0;

  constructor(
    private storageSrv: StorageService,
    private websocketSrv: WebsocketService
  ) {}

  addNewPlayer(type: PlayerType) {
    const lastIndex = this.gameBoard.length;
    this.gameBoard.push({
      number: lastIndex + 1,
      type: type === 'computer' && lastIndex === 0 ? 'local' : type,
      score: 0,
      state: type === 'remote' ? 'connect' : 'wait',
    });
  }

  newGame(type: PlayerType) {
    this.resetGame();

    // Check for previous players
    this.addNewPlayer(type);

    // If more than 2 players this is the code that should be updated
    if (type === 'computer' || type === 'local') {
      this.addNewPlayer(type);
    }

    if (type === 'remote') {
      this.listenRemoteUpdates();
    }

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

  setPlayerAssigned(playerAssigned: number) {
    this.indexAssigned = playerAssigned - 1;
  }

  setPlayerState(playerNumber: number, playerState: PlayerState) {
    this.gameBoard[playerNumber].state = playerState;
    this.updateGameBoard();
  }

  setPlayerName(playerNumber: number, playerName?: string) {
    const name = (
      (playerName ?? this.gameBoard[playerNumber].name) as string
    ).toLocaleLowerCase();
    const playerFound = this.storageSrv.getPlayer(name);
    this.gameBoard[playerNumber].name = name;
    this.gameBoard[playerNumber].score = playerFound?.score ?? 0;
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

  updateGameBoard(sendBack = true) {
    console.log('Update Game', this.gameBoard);
    this.gameBoardSub.next(this.gameBoard);
    const isRemote = this.gameBoard[0].type;
    if (isRemote && sendBack) {
      this.websocketSrv.sendMessage(this.gameBoard);
    }
  }

  listenRemoteUpdates() {
    this.playerAssigned$ = this.websocketSrv.playerAssigned$;
    this.socketSubscription = this.websocketSrv.gameBoard$.subscribe(
      (response) => {
        if (response.length) {
          this.gameBoard = response;
          this.updateGameBoard(false);
        }
      }
    );
    this.websocketSrv.openWSConnection();
  }

  resetGame() {
    this.gameBoard = [];
    this.socketSubscription?.unsubscribe();
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
