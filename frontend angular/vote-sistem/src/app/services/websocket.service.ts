import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { io } from "socket.io-client";
@Injectable({
  providedIn: 'root'
})
export class WebsocketService {
  private socket = io('http://localhost:3000')

  receiveUpdate(): Observable<any>{
    return new Observable((observer) => {
      this.socket.on("updateVotes", (data) => observer.next(data));
    }
    )
  }
}
