import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
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
  public socket$ = this.socketSbj$.asObservable() as Observable<Player>;

  sendMessage(message: any): void {
    this.socketSbj$.next(JSON.stringify(message));
  }
}
