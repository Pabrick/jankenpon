import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { GameService } from '../../services/game.service';
import { PlayerType } from '../../types/player.types';
import { selections as SELECTIONS } from './../../const/selections';

@Component({
  selector: 'selection',
  standalone: true,
  imports: [],
  templateUrl: './selection.component.html',
  styleUrl: './selection.component.scss',
})
export class SelectionComponent {
  selections = SELECTIONS;
  constructor(
    public readonly router: Router,
    public readonly gameSrv: GameService
  ) {}

  handleClickSelection(type: PlayerType) {
    if (type === 'remote') {
      alert('Sorry, not ready yet');
      return;
    }

    this.gameSrv.newGame(2, type);
    this.router.navigate(['./name']);
  }
}
