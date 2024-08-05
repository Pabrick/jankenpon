import { Injectable } from '@angular/core';
import {
  Player,
  PlayerChoice,
  PlayerResult,
  PlayerState,
  PlayerType,
} from '../types/player.types';
import { BehaviorSubject, map, Subscription, tap } from 'rxjs';
import { StorageService } from './storage.service';
import { WebsocketService } from './websocket.service';

@Injectable({
  providedIn: 'root',
})
export class GameService {
  opponent!: PlayerType;

  // player1!: Player;
  player1Sub = new BehaviorSubject<Player | undefined>(undefined);
  player1$ = this.player1Sub.asObservable();

  // player2!: Player;
  player2Sub = new BehaviorSubject<Player | undefined>(undefined);
  player2$ = this.player2Sub.asObservable();

  socketSubscription!: Subscription;
  currentPlayer!: Player;

  currentIndex = 0;
  players!: Player[];
  playerSubs = [this.player1Sub, this.player2Sub];

  constructor(
    private storageSrv: StorageService,
    private websocketSrv: WebsocketService
  ) {
    this.socketSubscription = this.websocketSrv.socket$.subscribe(
      ({ number }: Player) => {
        if (this.opponent === 'remote') {
          if (number) {
            this.currentIndex = number - 1;
          }
        }
      }
    );
  }

  get player1() {
    return this.players[0];
  }
  get player2() {
    return this.players[1];
  }

  initGame() {
    this.currentIndex = 0;
    this.players = [
      {
        number: 1,
        type: undefined,
        name: 'Player 1',
        score: 0,
        state: 'wait',
      },
      {
        number: 2,
        type: undefined,
        name: this.opponent === 'computer' ? 'COMPUTER' : 'Player 2',
        score: 0,
        state: 'wait',
      },
    ];

    this.player1Sub.next(this.player1);
    this.player2Sub.next(this.player2);
  }

  closeGame() {
    this.socketSubscription?.unsubscribe();
  }

  resetGame() {
    this.updatePlayerState(1, 'choice');
    this.updatePlayerState(2, 'wait');
  }

  startGame() {
    console.log('opponent', this.opponent);

    if (this.opponent === 'remote') {
      this.playerSubs[this.currentIndex - 1].next({
        ...this.players[this.currentIndex - 1],
        state: 'name',
      });
    } else {
      this.player1Sub.next({
        ...this.players[0],
        state: 'name',
      });
      this.player2Sub.next({
        ...this.players[1],
        state: 'name',
      });
    }

    // // If we are player 1, we always show to enter your name.
    // if (this.currentIndex === 0) {
    // this.player1Sub.next({
    //   ...this.players[0],
    //   state: 'name',
    // });
    // }

    // if (this.currentPlayer.number === 2 && this.opponent === 'remote') {
    //   this.player2Sub.next({
    //     ...this.player2,
    //     state: 'name',
    //   });
    // }
    // console.log('startGame', this.currentPlayer);
  }

  updatePlayerState(playerNumber: number, state: PlayerState) {
    if (playerNumber === 1) {
      this.player1Sub.next({
        ...this.player1,
        state,
      });
    }
    if (playerNumber === 2) {
      this.player2Sub.next({
        ...this.player2,
        state,
      });
    }
  }

  updateResult() {
    const { p1, p2 } = this.getResult(
      this.player1.choice as PlayerChoice,
      this.player2.choice as PlayerChoice
    );

    const p1Score = this.player1.score || 0;
    const p2Score = this.player2.score || 0;

    // this.player1 = {
    //   ...this.player1,
    //   result: p1,
    //   score: p1 === 'win' ? p1Score + 1 : p1Score,
    // };

    // this.player2 = {
    //   ...this.player2,
    //   result: p2,
    //   score: p2 === 'win' ? p2Score + 1 : p2Score,
    // };
  }

  getRandomChoice() {
    const choices: PlayerChoice[] = ['rock', 'paper', 'scissors'];
    const randomIndex = Math.floor(Math.random() * choices.length);
    return choices[randomIndex];
  }

  saveScore() {
    this.storageSrv.saveScore(
      this.player1.name as string,
      this.player1.score as number
    );

    this.storageSrv.saveScore(
      this.player2.name as string,
      this.player2.score as number
    );
  }

  private getResult(p1: PlayerChoice, p2: PlayerChoice) {
    let p1Result: PlayerResult = 'tie';
    let p2Result: PlayerResult = 'tie';

    if (p1 === 'rock' && p2 === 'paper') {
      p1Result = 'lose';
      p2Result = 'win';
    }
    if (p1 === 'rock' && p2 === 'scissors') {
      p1Result = 'win';
      p2Result = 'lose';
    }
    if (p1 === 'paper' && p2 === 'rock') {
      p1Result = 'win';
      p2Result = 'lose';
    }
    if (p1 === 'paper' && p2 === 'scissors') {
      p1Result = 'lose';
      p2Result = 'win';
    }

    if (p1 === 'scissors' && p2 === 'rock') {
      p1Result = 'lose';
      p2Result = 'win';
    }
    if (p1 === 'scissors' && p2 === 'paper') {
      p1Result = 'win';
      p2Result = 'lose';
    }

    return {
      p1: p1Result,
      p2: p2Result,
    };
  }
}
