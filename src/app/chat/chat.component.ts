import { Component, OnInit, AfterViewInit, ElementRef, ViewChild, ViewChildren, QueryList } from '@angular/core';
import { ChatService } from '../services/chat.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss'],
})
export class ChatComponent implements OnInit, AfterViewInit {

  @ViewChildren('messages') messages: QueryList<any>
  @ViewChild('scrollMe') myScrollContainer
  disableScrollDown = false;
  newMessage = {
    sender: localStorage.getItem('name'),
    message: '',
  };
  messageList = [];
  users = [];
  chatbox;

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

  ngAfterViewInit() {
    this.scrollToBottom();
    this.messages.changes.subscribe(this.scrollToBottom);
  }

  scrollToBottom() {
    console.log("scrollToBottom");
    console.log(this.myScrollContainer.nativeElement.scrollHeight)
    this.myScrollContainer.nativeElement.scrollTop = 405;
    try {
      this.myScrollContainer.nativeElement.scrollTop = this.myScrollContainer.nativeElement.scrollHeight;
    } catch (err) { console.log(err) }
  }


  onScroll() {
    let element = this.myScrollContainer.nativeElement;
    let atBottom = element.scrollHeight - element.scrollTop === element.clientHeight;
    if(this.disableScrollDown && atBottom)
      this.disableScrollDown = false;
    else
      this.disableScrollDown = true;
  }


  sendMessage() {
    var localMessage = {
      sender: 'Me',
      message: '',
    };
    localMessage.message = this.newMessage.message;
    this.pushMessage(localMessage);
    this.chatService.sendMessage(this.newMessage);
    this.newMessage.message = '';
  }

  getOldMessages() {
    this.chatService.getOldMessages().subscribe((messages) => {
      messages.forEach((message) => {
        if (message.sender == localStorage.getItem('name'))
          message.sender = 'Me';
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
