import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { ThrowStmt } from '@angular/compiler';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private Token;
  private user;
  constructor(private http: HttpClient) {}

  localLogin(userData): Observable<any> {
    return this.http
      .post('https://localhost:3443/localLogin', userData)
      .pipe(catchError(this.handleError));
  }

  setUserDetails(Token?): Observable<any> {
    this.Token = Token;
    return this.http.get('https://localhost:3443/users/getUserDetails');
  }

  getAToken(): Observable<any> {
    return this.http.get('https://localhost:3443/checkCode');
  }

  getToken() {
    return this.Token;
  }

  
  handleError(error: HttpErrorResponse | any) {
    let errMsg: string;

    if (error.error instanceof ErrorEvent) {
      errMsg = error.error.message;
    } else {
      errMsg = `${error.status} - ${error.statusText || ''} ${error.message}`;
      console.log(errMsg)
    }
    return throwError(errMsg);
  }
}
