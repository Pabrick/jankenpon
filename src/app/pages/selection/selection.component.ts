import { Component, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { GameService } from '@/services/game/game.service';
import { PlayerType } from '@/types/player.types';
import { selections as SELECTIONS } from '@/const/selections';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'selection',
  standalone: true,
  imports: [],
  templateUrl: './selection.component.html',
  styleUrl: './selection.component.scss',
})
export class SelectionComponent implements OnDestroy {
  selections = SELECTIONS;
  destroyed$ = new Subject();
  disabledButtons = false;

  constructor(
    public readonly router: Router,
    public readonly gameSrv: GameService
  ) {}

  ngOnDestroy(): void {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }

  handleClickSelection(type: PlayerType) {
    this.gameSrv.newGame(type);

    if (type !== 'remote') {
      this.router.navigate(['./name']);
      return;
    }

    this.disabledButtons = true;
    // This should be handled properly with an ErrorService
    setTimeout(() => {
      this.disabledButtons = false;
    }, 5000);

    this.gameSrv.playerAssigned$
      .pipe(takeUntil(this.destroyed$))
      .subscribe((response) => {
        if (response !== 0) {
          this.gameSrv.setPlayerAssigned(response);
          this.router.navigate(['./name']);
        }
      });
  }
}
