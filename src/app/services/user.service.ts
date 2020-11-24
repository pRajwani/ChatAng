import { HttpClient } from '@angular/common/http';
import { ThrowStmt } from '@angular/compiler';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class UserService {
  constructor(private http:HttpClient){}
  checkCode(code){
    return this.http.post('https://localhost:3443/checkCode',{code:code})
    }
}
