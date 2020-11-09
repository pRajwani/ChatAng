import { Component, OnInit } from '@angular/core';
import { ChatService } from '../services/chat.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss'],
})
export class ChatComponent implements OnInit {

  newMessage = {
    sender: localStorage.getItem('name'),
    message: '',
  };
  messageList = [];
  users = [];
  constructor(
    private chatService: ChatService,
    private snackbar: MatSnackBar
  ) {}

  ngOnInit() {
    this.getOldMessages();
    this.getUsers();
    this.getMessages();
    this.getNotification();
  }

  sendMessage() {
    var localMessage = {
      sender: 'Me',
      message: '',
      margin: 'auto'
    };
    localMessage.message = this.newMessage.message;
    this.pushMessage(localMessage);
    this.chatService.sendMessage(this.newMessage);
    this.newMessage.message = '';
  }

  getOldMessages() {
    this.chatService.getOldMessages().subscribe((messages) => {
      messages.forEach((message) => {
        if (message.sender == localStorage.getItem('name')){
          message.sender = 'Me';
          message.margin = 'auto';
        }
        this.pushMessage(message);
      });
    });
  }

  getUsers() {
    this.chatService.getUsers().subscribe((users) => {
      users.forEach((user) => {
        this.users.push(user);
      });
    });
  }

  getMessages() {
    this.chatService.getMessages().subscribe((msg) => {
      console.log(msg);
      this.messageList.push(msg);
    });
  }
  getNotification() {
    this.chatService.getNotification().subscribe((notify) => {
      this.snackbar.open(notify, 'Ok', { duration: 4000 });
    });
  }
  pushMessage(message) {
    this.messageList.push(message);
  }
}
