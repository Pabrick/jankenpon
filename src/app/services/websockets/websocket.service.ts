import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { webSocket } from 'rxjs/webSocket';
import { Player } from '../../types/player.types';

const WS_PORT = '3000';
const WS_SERVER = 'ws://localhost';
const WS_URL = `${WS_SERVER}:${WS_PORT}`;

@Injectable({
  providedIn: 'root',
})
export class WebsocketService {
  public socketSbj$ = webSocket(WS_URL);
  public socket$ = this.socketSbj$.asObservable() as Observable<any>;

  socketSubscription!: Subscription;
  playerAssignedSub = new BehaviorSubject<number>(0);
  playerAssigned$ = this.playerAssignedSub.asObservable();
  gameBoardSub = new BehaviorSubject<Player[]>([]);
  gameBoard$ = this.gameBoardSub.asObservable();

  openWSConnection() {
    console.log('Opening WS connection...');
    this.socketSubscription = this.socket$.subscribe(
      (response) => {
        if (response.size) {
          console.log('Conection Number: ', response.size);
          this.playerAssignedSub.next(response.size);
        }

        if (typeof response === 'string') {
          const game = JSON.parse(response);
          this.gameBoardSub.next(game);
        }
      },
      (err) => {
        console.error('Connection Error', err);
        alert('Sorry, the Server is OFF');
      }
    );

    return this.socket$;
  }

  closeWSConnection() {
    console.log('Closing WS connection...');
    this.socketSubscription.unsubscribe();
  }

  sendMessage(message: any): void {
    this.socketSbj$.next(JSON.stringify(message));
  }
}
