import { BrowserModule } from '@angular/platform-browser';
import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';


import { AppComponent } from './app.component';
import { ChatComponent } from './chat/chat.component';
import { FormsModule } from '@angular/forms';
import { LoginComponent } from './login/login.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { FlexLayoutModule } from '@angular/flex-layout';


const config: SocketIoConfig = { url: 'https://localhost:3443', options: {} };

@NgModule({
  declarations: [
    AppComponent,
    ChatComponent,
    LoginComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    SocketIoModule.forRoot(config),
    BrowserAnimationsModule,
    HttpClientModule,
    FlexLayoutModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
