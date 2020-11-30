import { Injectable, Injector } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { UserService } from './user.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private inj:Injector) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    console.log("In the intercepter")
    const authService = this.inj.get(UserService);
    const authToken = authService.getToken();
    console.log(authToken)
     const authReq = request.clone({headers: request.headers.set('Authorization', 'Bearer' + " " + authToken),
    withCredentials:true});
    return next.handle(authReq);
  }
}
