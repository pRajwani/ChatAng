import { Component, OnInit } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { ActivatedRoute, Router } from "@angular/router";

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
    password:''
  }
  constructor(private http:HttpClient,private route:Router,private router:ActivatedRoute) { }

  ngOnInit(): void {
    this.router.queryParams
      .subscribe(params => {
        if(params.code) {
          this.checkCode(params).subscribe((status:any)=>{
            if(status.resp==true){
              this.username=params.name
              console.log(this.username)
              localStorage.setItem('name',this.username)
              localStorage.setItem('authCode',params.code)
              this.route.navigate(['/chat'])
            } 
            else
            this.route.navigate(['/'])
          });
        }
        console.log(params.code);
        
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
        localStorage.setItem('name', status.user)
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
