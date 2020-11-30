import { Component, OnInit } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { ActivatedRoute, Router } from "@angular/router";
import { UserService } from '../services/user.service';
import { Token } from '@angular/compiler/src/ml_parser/lexer';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  code
  username
  userData={ 
    username:'',
    password:'',
    code:1
  }
  constructor(private http:HttpClient,private route:Router,private router:ActivatedRoute, private userService:UserService) { }

  ngOnInit(): void {
    
}

  facebookLogin(){
    this.http.get('https://localhost:3443/fbcallback').subscribe((status)=>{
      if(status==true)
        this.route.navigate(['/chat'])
        else 
        alert('cannot login')
    })
  }

  localLogin(){
    this.userService.localLogin(this.userData).subscribe((Token) => { 
      if(Token !=undefined) {
        console.log(Token)
        this.userService.setUserDetails(Token).subscribe() ;
        this.route.navigate(['/chat'])
      }
      else 
      alert('cannot login')  
    })
  }

}
