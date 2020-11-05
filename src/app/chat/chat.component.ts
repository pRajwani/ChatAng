import { Component, OnInit } from '@angular/core';
import { ChatService } from '../services/chat.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit {
  newMessage = {
    sender:localStorage.getItem("name"),
    message:""
  };
  messageList=[];
  users=[]
  constructor(private chatService: ChatService) { }

  sendMessage() {
    var localMessage={
      sender:"Me",
      message:''
    }
    localMessage.message=this.newMessage.message
    this.pushMessage(localMessage);
    this.chatService.sendMessage(this.newMessage);
    this.newMessage.message= "";
  }
  ngOnInit() {
    
    this.chatService.getUsers().subscribe((users)=>{
      users.forEach(user => {
        this.users.push(user)
      });
    })
    this.chatService.getMessages().subscribe((msg)=>{
      this.messageList.push(msg)
    })
    
  }
  pushMessage(message){
    this.messageList.push(message)
  }

}
