import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { HubConnection, HubConnectionBuilder, HubConnectionState } from '@microsoft/signalr';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, FormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {

  title = 'MsgClient';


  connection!: HubConnection;

  Messages: ChatMessage[] = [];
  public user!: string | null;
  public message: string = "";

  constructor() {
    this.connection = new HubConnectionBuilder()
      .withUrl("https://localhost:7062/chat")
      .withAutomaticReconnect()
      .withServerTimeout(1000*30)
      .build();
  }

  ngOnInit(): void {

    while (!this.user)
      this.user = prompt("Enter Your Name");

    this.connection.on('Receive', (user, message) => {
      this.Messages.push(new ChatMessage(user, message));
    });

    this.connection.on('ReceiveImg', (user, message) => {
      this.Messages.push(new ChatMessage(user, message, true));
    });

    this.connection.start();
  }
  get disconnected(): boolean {
    return this.connection.state != HubConnectionState.Connected;
  }

  SendMsg() {
    this.connection.invoke("Send",this.user,this.message)
    this.message='';
  }
  fileSelect(ev: any) {


    const file = ev.target.files[0];

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      this.connection.invoke("SendImg", this.user, reader.result);
    };

  }
}
export class ChatMessage {
  constructor(public UserName: string, public Message: string, public IsImg: boolean = false) {

  }
}
