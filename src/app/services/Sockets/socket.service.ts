import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SocketService {

  constructor(private socket: Socket) { }

  // emit event
  // fetchEventResult() {
  //   // this.socket.emit('score','test');
  // }

  // listen event
  getLiveScore() {
    //for get Live Score
    this.socket.connect();
    return new Observable((observer: any) => {
      this.socket.on('score', (message: any) => {
        observer.next(message);
      });
    });
  }
}
