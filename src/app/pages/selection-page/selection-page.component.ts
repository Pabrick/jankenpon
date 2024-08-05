import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { GameService } from '../../services/game.service';

@Component({
  selector: 'selection-page',
  standalone: true,
  imports: [],
  templateUrl: './selection-page.component.html',
  styleUrl: './selection-page.component.scss',
})
export class SelectionPageComponent {
  constructor(public readonly router: Router, private gameSrv: GameService) {}

  onClickOpponentComputer() {
    this.gameSrv.opponent = 'computer';
    this.router.navigate(['./game']);
  }

  onClickOpponentLocal() {
    this.gameSrv.opponent = 'local';
    this.router.navigate(['./game']);
  }

  onClickOpponentRemote() {
    this.gameSrv.opponent = 'remote';
    // alert('Sorry, not ready yet');
    this.router.navigate(['./game']);
  }
}
