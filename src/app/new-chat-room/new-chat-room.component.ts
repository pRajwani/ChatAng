import { Component, OnInit } from '@angular/core';
import { ChatService } from '../services/chat.service';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-new-chat-room',
  templateUrl: './new-chat-room.component.html',
  styleUrls: ['./new-chat-room.component.scss']
})
export class NewChatRoomComponent implements OnInit {

  roomName;  
  reciever;

  constructor(private userService: UserService, private chatService: ChatService) { }

  ngOnInit(): void {
  }

  newRoom() {
    var user = this.userService.getUser();
    var room = {
      roomName: this.roomName,
      participants: [
        this.reciever, user._id
      ],
      privateChat: true
    }
    console.log(room);
    this.chatService.newRoom(room);
  }
}
