import { Component, ElementRef, OnInit, ViewChild, AfterViewChecked } from '@angular/core';
import { ChatService } from '../services/chat.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss'],
})
export class ChatComponent implements OnInit, AfterViewChecked {
  messageList = [];
  rooms = [];
  query;
  user;
  roomMessages = [];
  newMessage;
  text;
  room;
  scroll;
  disableScrollDown = false;
  @ViewChild('scrollme') myScrollContainer:ElementRef;
  constructor(
    private chatService: ChatService,
    private userService: UserService,
    private snackbar: MatSnackBar
    ) {}
  
    ngAfterViewChecked() {
    const newMessage = this.myScrollContainer.nativeElement.lastElementChild;

    const newMessageStyles = getComputedStyle(newMessage);
    const newMessageMargin = parseInt(newMessageStyles.marginBottom);
    const newMessageHeight = newMessage.offsetHeight + newMessageMargin;

    const visibleHeight = this.myScrollContainer.nativeElement.offsetHeight;
    const containerHeight = this.myScrollContainer.nativeElement.scrollHeight;
    const scrollOffset = this.myScrollContainer.nativeElement.scrollTop + visibleHeight;

    console.log(containerHeight - newMessageHeight <= scrollOffset)

    if(containerHeight - newMessageHeight <= scrollOffset) {
      this.myScrollContainer.nativeElement.scrollTop = this.myScrollContainer.nativeElement.scrollHeight;
      
    }
    }

    private onScroll() {
      let element = this.myScrollContainer.nativeElement
      let atBottom = element.scrollHeight - element.scrollTop === element.clientHeight
      if (this.disableScrollDown && atBottom) {
          this.disableScrollDown = false
      } else {
          this.disableScrollDown = true
      }
  }


  private scrollToBottom(): void {
      if (this.disableScrollDown) {
          return
      }
      try {
          this.myScrollContainer.nativeElement.scrollTop = this.myScrollContainer.nativeElement.scrollHeight;
      } catch(err) { }
  }
    ngOnInit() {
    this.scroll = document.querySelector('#scrollme')
    console.log(this.scroll.lastElementChild)
    this.userService
      .checkCode(JSON.stringify(localStorage.getItem('authCode')))
      .subscribe((status: any) => {
        console.log(status)
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
      message: this.text,
    };
    this.room.participants.forEach((participant) => {
      if (participant != this.user._id) this.newMessage.reciever = participant;
    });
    this.pushMessage(this.newMessage);
    this.chatService.sendMessage(this.newMessage);
    this.text = '';
    //this.autoScroll(document.querySelector("#scrollme"));

  }

  getOldMessages(userId) {
    this.chatService.getOldMessages(userId).subscribe((messages) => {
      this.messageList = messages;
    });
  }

  getRoomMessages(room) {
    this.room = room;
    this.roomMessages = [];
    this.messageList.forEach((message) => {
      if (message.roomId == room._id) this.roomMessages.push(message);
      
    });
    //this.autoScroll(this.scroll);
  }

  getRooms(userId) {
    this.chatService.getRooms(userId).subscribe((rooms) => {
      this.rooms = rooms;
      this.chatService.joinRoom(rooms);
    });
  }

  getMessages() {
    this.chatService.getMessages().subscribe(async (msg) => {
      await this.pushMessage(msg);
      console.log("new message")
      //await this.autoScroll(document.querySelector("#scrollme"));
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
    //this.autoScroll(document.querySelector("#scrollme"));

  }

  autoScroll(scroll) {
    console.log("autoscroll")
    console.log(scroll.lastElementChild)
    const newMessage = scroll.lastElementChild;
    

    const newMessageStyles = getComputedStyle(newMessage);
    const newMessageMargin = parseInt(newMessageStyles.marginBottom);
    const newMessageHeight = newMessage.offsetHeight + newMessageMargin;

    const visibleHeight = scroll.offsetHeight;
    const containerHeight = scroll.scrollHeight;
    const scrollOffset = scroll.scrollTop + visibleHeight;

    console.log(containerHeight, scrollOffset)

    scroll.scrollTop = scroll.scrollHeight;
    if(containerHeight - newMessageHeight <= scrollOffset) {
      
    }
   
  }
}
