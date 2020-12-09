import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  msg = '';
  constructor(private socket: Socket, private http: HttpClient) {}

  public sendMessage(message) {
    this.socket.emit('new-msg', message);
  }

  public newRoom(room) {
    this.socket.emit('newChatRoom', room);
  }

  public getMessages() {
    return new Observable((observer) => {
      this.socket.on('new-msg', (message) => {
        observer.next(message);
      });
    });
  }

  public getNotification() {
    return new Observable((observer) => {
      this.socket.on('notification', (data) => {
        observer.next(data);
      });
    });
  }

  public getRooms(userId): Observable<any> {
    return this.http.post('https://localhost:3443/users/getRooms',{userId:userId});
  }

  public getOldMessages(userId): Observable<any> {
    return this.http.post('https://localhost:3443/message', {userId:userId});
  }

  public joinRoom(rooms){
    this.socket.emit('joinRoom',rooms)
  }
}
