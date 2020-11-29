import { Component, OnInit } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { ActivatedRoute, Router } from "@angular/router";
import { UserService } from '../services/user.service';

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
    this.router.queryParams
      .subscribe(params => {
        if(params.code) {
          this.userService.checkCode(params.code).subscribe((status:any)=>{
            if(status.resp==true){
              this.username=status.user.name;
              localStorage.setItem('name',this.username);
              localStorage.setItem('authCode',params.code);
              this.route.navigate(['/chat'])
            } 
            else
            this.route.navigate(['/'])
          });
        }        
  })
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
    this.http.post('https://localhost:3443/localLogin',this.userData).subscribe((status:any)=>{
      if(status.success==true) {
        this.userService.checkCode(status.code).subscribe((resp:any)=> {
          if(resp.resp==true) localStorage.setItem('authCode', status.code)
          else this.route.navigate(['/']);
        })
        this.route.navigate(['/chat'])
      }
        else 
        alert('cannot login')
    })
  }

  checkCode(params){
    return this.http.post('https://localhost:3443/checkCode',{code:params.code})
    }

}
