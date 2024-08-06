import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Player } from '../../types/player.types';
import { GameService } from '../../services/game.service';
import { FooterComponent } from '../../components/footer/footer.component';
import { choices as CHOICES } from './../../const/choices';
import { results as RESULTS } from './../../const/results';

@Component({
  selector: 'app-result',
  standalone: true,
  imports: [FooterComponent],
  templateUrl: './result.component.html',
  styleUrl: './result.component.scss',
})
export class ResultComponent {
  choices = CHOICES;
  results = RESULTS;
  gameBoard!: Player[];

  constructor(
    public readonly router: Router,
    public readonly gameSrv: GameService
  ) {
    this.gameSrv.gameBoard$.pipe(takeUntilDestroyed()).subscribe((response) => {
      this.gameBoard = response as Player[];
      if (!this.gameBoard) {
        this.router.navigate(['./']);
        return;
      }

      for (let i = 0; i < this.gameBoard.length; i++) {
        this.gameBoard[i].result = this.gameSrv.getResult(this.gameBoard, i);
        if (
          this.gameBoard[i].state === 'wait' &&
          this.gameBoard[i].result === 'win' &&
          this.gameBoard[i].type !== 'computer'
        ) {
          this.gameSrv.updatePlayerScore(i, 1);
        }
      }
    });
  }
}
