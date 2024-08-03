import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { StorageService } from '../../services/storage.service';
import {
  Player,
  PlayerChoice,
  PlayerEmitter,
  PlayerScoreboard,
} from '../../types/player.types';
import { Observable } from 'rxjs';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'player',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './player.component.html',
  styleUrl: './player.component.scss',
})
export class PlayerComponent {
  @Input() player$!: Observable<Player | undefined>;
  @Output() onFinishStateEmt: EventEmitter<PlayerEmitter> = new EventEmitter();
  inputValue!: string;
  playerName!: string;
  playerFound!: PlayerScoreboard | undefined;
  score = 0;
  showModal = false;

  constructor(private storageSrv: StorageService) {}

  handleSaveName() {
    if (this.inputValue) {
      this.playerName = this.inputValue.toLocaleLowerCase();
      this.playerFound = this.storageSrv.getPlayer(this.playerName);
      if (!this.playerFound) {
        this.handleNewScore();
      } else {
        this.showModal = true;
      }
    }
  }

  handlePreviousScore() {
    this.score = this.playerFound?.score || 0;
    this.showModal = false;
    this.emitName();
  }

  handleNewScore() {
    this.score = 0;
    this.showModal = false;
    this.storageSrv.saveName(this.playerName);
    this.emitName();
  }

  handleChoice(choice: PlayerChoice) {
    this.onFinishStateEmt.emit({
      state: 'choice',
      extra: choice,
    });
  }

  private emitName() {
    this.onFinishStateEmt.emit({
      state: 'name',
      extra: {
        name: this.playerName,
        score: this.score,
      },
    });
  }
}
