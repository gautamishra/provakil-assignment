import { Component, OnInit, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { ChatService } from 'src/app/service/chat.service';
import { Message, Createmessage } from './../../modal/message';
import { Subject } from 'rxjs';
import { takeUntil, take } from 'rxjs/operators';

// import io from 'socket.io-client';
// import sailsIOClient from 'sails.io.js';

// let io = sailsIOClient(socketIOClient);

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit, OnDestroy {

  registerUser = true;
  textMessage = '';
  userName = '';
  channelName = 'general';
  allMessages: Message[] = [];
  private unsubscribe$ = new Subject();
  @ViewChild('chatContainer') chatContainer: ElementRef;

  constructor(private chatSerive: ChatService,
    private socket: Socket
  ) { }

  ngOnInit() {
    // this.postMessage();
    // this.getMessages();
    this.socket.on('message', (data) => {
      console.log(data);
    });

    this.polling();
  }

  polling = () => {
    setInterval(() => {
      this.getMessages();
    }, 3000);
  }

  getMessages = () => {
    this.chatSerive.getMessages(this.channelName, 0)
      .pipe(
        takeUntil(this.unsubscribe$)
      )
      .subscribe((data: any) => {
        this.allMessages = data;
        if (!!this.chatContainer) {
          this.chatContainer.nativeElement.scrollTop = this.chatContainer.nativeElement.scrollHeight;
        }
      });
    // this.socket.on('messages', (data) => {
    //   console.log(data);
    // });
  }

  postMessage = () => {
    if (!!this.textMessage) {
      if (!!this.textMessage.match('/NICK') && this.textMessage.indexOf('/NICK') === 0) {
        this.updateUserName();
        return;
      }
      const mesg: Createmessage = {
        username: this.userName,
        msg: this.textMessage,
        channel: this.channelName
      };
      this.chatSerive.postMessages(mesg)
        .pipe(
          takeUntil(this.unsubscribe$)
        )
        .subscribe(data => {
          console.log(data);
          this.getMessages();
        });
      this.textMessage = '';
    }
  }

  startChating = () => {
    this.registerUser = !this.registerUser;
    this.getMessages();
  }

  updateUserName = () => {
    const newName = this.textMessage.split('/NICK')[1];
    return this.chatSerive.updateuserName(newName)
      .subscribe((data) => {
        console.log(data);
      });
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

}
