import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Player } from '../../types/player.types';
import { GameService } from '../../services/game/game.service';
import { FooterComponent } from '../../components/footer/footer.component';

@Component({
  selector: 'app-name',
  standalone: true,
  imports: [CommonModule, FormsModule, FooterComponent],
  templateUrl: './name.component.html',
  styleUrl: './name.component.scss',
})
export class NameComponent {
  gameBoard!: Player[];

  constructor(public readonly router: Router, public gameSrv: GameService) {
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
          this.gameBoard[i].name = 'Computer';
        }

        if (currentPlayer.name === undefined) {
          this.gameBoard[i].state = 'name';
          return;
        }

        if (
          currentPlayer.state === 'name' ||
          currentPlayer.name === undefined
        ) {
          ready2NextStep = false;
        }
      }

      if (ready2NextStep) {
        this.gameBoard = [];
        this.router.navigate(['./choice']);
      }
    });
  }

  handleSaveName(index: number) {
    if (this.gameBoard[index].name) {
      this.gameSrv.setPlayerName(index);
    }
  }
}
