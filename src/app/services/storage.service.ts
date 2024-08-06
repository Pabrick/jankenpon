import { Injectable } from '@angular/core';
import { PlayerScoreboard } from '../types/player.types';

@Injectable({
  providedIn: 'root',
})
export class StorageService {
  public scoreboard: PlayerScoreboard[] = [];
  private _localStorageKey = 'jankenpon';

  constructor() {
    this.getScoreboard();
  }

  // get the scoreboard from memory
  getScoreboard() {
    try {
      const data = localStorage.getItem(this._localStorageKey);
      if (data) {
        this.scoreboard = JSON.parse(data);
      }
    } catch (e) {
      console.error(e);
    }
  }

  // get a player and its score if found in the PlayerScoreboard
  // otherwise returns undefined
  getPlayer(name: string): PlayerScoreboard | undefined {
    return this.scoreboard.find((player) => player.name === name);
  }

  // save a new player with initial score of ZERO
  saveName(name: string) {
    this.scoreboard.push({ name, score: 0 });
    localStorage.setItem(
      this._localStorageKey,
      JSON.stringify(this.scoreboard)
    );
  }

  // save the score of a player if found
  saveScore(name: string, score: number) {
    const newScoreboard = this.scoreboard.map((player) => {
      if (player.name !== name) {
        return player;
      }

      return {
        name,
        score,
      };
    });

    localStorage.setItem(this._localStorageKey, JSON.stringify(newScoreboard));
    this.scoreboard = newScoreboard;
  }
}
