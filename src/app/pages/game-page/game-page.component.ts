import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { PlayerComponent } from '../../components/player/player.component';
import {
  PlayerChoice,
  PlayerEmitter,
  PlayerScoreboard,
} from '../../types/player.types';
import { GameService } from '../../services/game.service';

@Component({
  selector: 'game-page',
  standalone: true,
  imports: [PlayerComponent],
  templateUrl: './game-page.component.html',
  styleUrl: './game-page.component.scss',
})
export class GamePageComponent {
  showAgainButton = false;

  constructor(public readonly router: Router, public gameSrv: GameService) {
    this.gameSrv.resetStates();
    this.gameSrv.startGame();
  }

  onClickBack() {
    this.router.navigate(['./']);
  }

  onClickAgain() {
    this.gameSrv.resetGame();
  }

  onFinishStep(playerNumber: number, playerEmmiter: PlayerEmitter) {
    if (playerEmmiter.state === 'name') {
      this.stepName(playerNumber, playerEmmiter);
    }

    if (playerEmmiter.state === 'choice') {
      this.stepChoice(playerNumber, playerEmmiter);
    }
  }

  private stepName(playerNumber: number, playerEmmiter: PlayerEmitter) {
    const { name, score } = playerEmmiter.extra as PlayerScoreboard;
    if (playerNumber === 1) {
      this.gameSrv.player1 = {
        name,
        score,
      };
      this.gameSrv.updatePlayerState(1, 'wait');
      this.gameSrv.updatePlayerState(2, 'name');
    }

    if (playerNumber === 2) {
      this.gameSrv.player2 = {
        name,
        score,
      };
    }

    if (playerNumber === 2 || this.gameSrv.opponent === 'computer') {
      this.gameSrv.updatePlayerState(1, 'choice');
      this.gameSrv.updatePlayerState(2, 'wait');
      this.showAgainButton = true;
    }
  }

  private stepChoice(playerNumber: number, playerEmmiter: PlayerEmitter) {
    const choice = playerEmmiter.extra as PlayerChoice;
    if (playerNumber === 1) {
      this.gameSrv.player1 = {
        ...this.gameSrv.player1,
        choice,
      };
      this.gameSrv.updatePlayerState(1, 'wait');
      this.gameSrv.updatePlayerState(2, 'choice');
    }

    if (playerNumber === 2) {
      this.gameSrv.player2 = {
        ...this.gameSrv.player2,
        choice,
      };
    }

    if (this.gameSrv.opponent === 'computer') {
      this.gameSrv.player2 = {
        ...this.gameSrv.player2,
        choice: this.gameSrv.getRandomChoice(),
      };
    }

    if (playerNumber === 2 || this.gameSrv.opponent === 'computer') {
      this.gameSrv.updateResult();

      this.gameSrv.updatePlayerState(1, 'result');
      this.gameSrv.updatePlayerState(2, 'result');

      this.gameSrv.saveScore();
    }
  }
}
