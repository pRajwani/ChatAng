import { Component, OnInit } from '@angular/core';
import { ChatService } from '../services/chat.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss'],
})
export class ChatComponent implements OnInit {
  messageList = [];
  rooms = [];
  query;
  user;
  roomMessages = [];
  newMessage;
  text;
  room;
  constructor(
    private chatService: ChatService,
    private userService: UserService,
    private snackbar: MatSnackBar
  ) {}

  async ngOnInit() {
    await this.userService
      .checkCode(JSON.stringify(localStorage.getItem('authCode')))
      .subscribe((status: any) => {
        this.user = status.user;
        this.getRooms(this.user._id);
        this.getOldMessages(this.user._id);
      });
    this.getMessages();
    this.getNotification();
  }

  sendMessage() {
    this.newMessage = {
      sender: this.user._id,
      roomId: this.room._id,
      message: this.text
    }
    this.room.participants.forEach(participant => {
      if(participant!=this.user._id) this.newMessage.reciever = participant;
    });
    this.pushMessage(this.newMessage);
    this.chatService.sendMessage(this.newMessage);
    this.text='';
  }

  getOldMessages(userId) {
    this.chatService.getOldMessages(userId).subscribe((messages) => {
      this.messageList = messages;
    });
  }

  getRoomMessages(room) {
    this.room = room;
    this.messageList.forEach(message=>{
      if(message.roomId==room._id)
        this.roomMessages.push(message)
    })
  }

  getRooms(userId) {
    this.chatService.getRooms(userId).subscribe((rooms) => {
      this.rooms = rooms;
      this.chatService.joinRoom(rooms);
    });
  }

  getMessages() {
    this.chatService.getMessages().subscribe((msg) => {
      this.pushMessage(msg)
    });
  }

  getNotification() {
    this.chatService.getNotification().subscribe((notify: any) => {
      this.snackbar.open(notify, 'Ok', { duration: 4000 });
    });
  }

  pushMessage(message) {
    this.roomMessages.push(message);
    this.messageList.push(message);
  }
}
