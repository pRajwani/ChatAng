import { HttpClient } from '@angular/common/http';
import { ThrowStmt } from '@angular/compiler';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class UserService {
  Token;
  user;
  constructor(private http:HttpClient){}
  checkCode(code){
    return this.http.post('https://localhost:3443/checkCode',{code:code})
    }

  async localLogin(userData):Promise<Observable<any>> {
    this.Token = await this.http.post('https://localhost:3443/localLogin', userData);
    this.user = await this.http.get('https://localhost:3443/users/getUserDetails');
    return this.user;
  }

  getUser(){
    if(this.user)
      return this.user;
  }

  
}
