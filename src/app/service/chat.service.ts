import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { HttpParams } from '@angular/common/http';
//  Internal imports
import { APIENDPOINTS } from './../constants/api-end-points';
import { Message } from '../modal/message';
import { Observable } from 'rxjs';
import { Socket } from 'ngx-socket-io';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  constructor(private _http: HttpClient,
    private socket: Socket) {

  }


  getMessages = (channelName: string, limit: number): Observable<Message[]> => {
    const params: any = new HttpParams()
      .set('channel', channelName)
      .set('limit', limit.toString());
    return this._http.get(APIENDPOINTS.message, {
      params: params
    })
      .pipe(
        map(res => res as Message[])
      );
  }

  postMessages = (data: any) => {
    return this._http.post(APIENDPOINTS.message, data);
  }

  postMessagesSocket = (data: any) => {
    this.socket.ioSocket.post(APIENDPOINTS.message, data, (resData, jwres) => {
      console.log({resData}, {jwres});
    });
  }

  updateuserName = (newName: string) => {
    return this._http.put(APIENDPOINTS.user , {
      username: newName
    });
  }

}
