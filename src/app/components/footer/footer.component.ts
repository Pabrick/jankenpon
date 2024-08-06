import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { GameService } from '../../services/game.service';

@Component({
  selector: 'game-footer',
  standalone: true,
  imports: [],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss',
})
export class FooterComponent {
  @Input() hasRematch: boolean = false;
  constructor(
    public readonly router: Router,
    public readonly gameSrv: GameService
  ) {}

  handleClickBack() {
    this.router.navigate(['./']);
  }

  handleRematch() {
    this.router.navigate(['./choice']);
  }
}
