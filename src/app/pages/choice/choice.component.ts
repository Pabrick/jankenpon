import { Component } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Player } from '@/types/player.types';
import { Router } from '@angular/router';
import { GameService } from '@/services/game.service';
import { choices as CHOICES } from '@/const/choices';
import { GameChoice } from '@/types/game.types';
import { FooterComponent } from '@/components/footer/footer.component';

@Component({
  selector: 'app-choice',
  standalone: true,
  imports: [FooterComponent],
  templateUrl: './choice.component.html',
  styleUrl: './choice.component.scss',
})
export class ChoiceComponent {
  choices = CHOICES;
  gameBoard!: Player[];

  constructor(
    public readonly router: Router,
    public readonly gameSrv: GameService
  ) {
    this.gameSrv.newRound();

    this.gameSrv.gameBoard$.pipe(takeUntilDestroyed()).subscribe((response) => {
      this.gameBoard = response as Player[];
      if (!this.gameBoard) {
        this.router.navigate(['./']);
        return;
      }

      // If all players have names and are waiting we go to next step
      let ready2NextStep = true;
      for (let i = 0; i < this.gameBoard.length; i++) {
        const currentPlayer = this.gameBoard[i];

        if (currentPlayer.type === 'computer') {
          this.gameBoard[i].choice = this.gameSrv.getRandomChoice();
        }

        if (currentPlayer.choice === undefined) {
          this.gameBoard[i].state = 'choice';
          return;
        }

        if (
          currentPlayer.state === 'choice' ||
          currentPlayer.choice === undefined
        ) {
          ready2NextStep = false;
        }
      }

      if (ready2NextStep) {
        this.gameBoard = [];
        this.router.navigate(['./result']);
      }
    });
  }

  handleChoice(index: number, choice: GameChoice) {
    if (this.gameBoard[index].name) {
      this.gameSrv.setPlayerChoice(index, choice);
    }
  }
}
