import { Component, ElementRef, OnInit, ViewChild, AfterViewChecked, AfterViewInit } from '@angular/core';
import { ChatService } from '../services/chat.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UserService } from '../services/user.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss'],
})
export class ChatComponent implements OnInit, AfterViewChecked{
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
    private snackbar: MatSnackBar,
    private router:ActivatedRoute
    ) {}
  
    ngAfterViewChecked() {
      this.myScrollContainer.nativeElement.scrollTop = this.myScrollContainer.nativeElement.scrollHeight;
    }
 
    async ngOnInit() {
      console.log("in Chat Component")
      this.router.queryParams.subscribe((params)=> {
        if(params.atok) {
          this.userService.setUserDetails(params.atok).subscribe((userData)=> {
            this.user = userData;
            this.setup();
          })
        }
        else {
          var token = this.userService.getToken()
          if(!token) {
            this.userService.getAToken().subscribe((token)=>{
            if(token.status == false){
              console.log(token.result);
              return;
            }
            this.userService.setUserDetails(token.result).subscribe((userData)=>{
              this.user = userData;
              console.log(this.user);
              this.setup();
              })
            })
          }
          else {
            this.userService.setUserDetails(token).subscribe((userData)=>{
              this.user = userData;
              this.setup();
            })
          }
        }
      }); 
  }

  setup() {
    console.log("setup", this.user)
    this.getRooms(this.user._id);
    this.getOldMessages(this.user._id);
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
