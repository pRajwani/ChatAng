import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { Observable, } from 'rxjs';
import { map } from "rxjs/operators";
import { HttpClient } from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  msg='';
  constructor(private socket: Socket,private http:HttpClient) { }

  public sendMessage(message) {
    this.socket.emit('new-msg', message);
  }

  public getMessages(){
    return Observable.create((observer)=>{
      this.socket.on('new-msg',(message)=>{
        observer.next(message);
      })
      this.socket.on('message',(data)=>{
        observer.next(data)
      })
    })
}
public getUsers():Observable<any>{
  return this.http.get('https://localhost:3443/users/getUsers')
}

public getOldMessages():Observable<any>{
  return this.http.get('https://localhost:3443/message')
}
}
