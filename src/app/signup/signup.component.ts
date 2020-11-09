import { Component, OnInit } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Router } from "@angular/router";

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {
  userData={
    username:'',
    name:'',
    password:''
  }
  constructor(private http:HttpClient,private router:Router) { }

  ngOnInit(): void {
  }

  createUser(){
    this.http.post('https://localhost:3443/signup',this.userData).subscribe((status:any)=>{
      console.log(status)
      if(status.success==true)
        this.router.navigate(['/chat'])
      else
        alert('Something went wrong')
    })
  }
}
