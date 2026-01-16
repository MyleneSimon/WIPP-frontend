import { Injectable } from '@angular/core';
import {environment} from '../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {CsvCollection} from '../csv-collection/csv-collection';

@Injectable({
  providedIn: 'root'
})
export class AiAssitantService {

  private aiChatUrl = 'http://localhost:8080/chat';

  constructor(private http: HttpClient) { }

  chat(conversationId: string, message: string): Observable<string> {
    return this.http.post(`${this.aiChatUrl}?conversationId=${conversationId}`, {userInput: `${message}`}, { responseType: 'text' });
  }

  // private aiChatUrl = 'http://localhost:8080/ai';
  //
  // constructor() { }
  //
  // chat(conversationId: string, message: string): Observable<string> {
  //   const eventSource = new EventSource(`${this.aiChatUrl}?conversationId=${conversationId}&userInput=${message}`, {
  //     withCredentials: true
  //   });
  //
  //   return new Observable((observer) => {
  //     eventSource.onmessage = (event) => {
  //       observer.next(event.data);
  //     };
  //
  //     eventSource.onerror = () => {
  //       observer.error('EventSource failed.');
  //       eventSource.close();
  //     };
  //
  //     eventSource.onopen = () => {
  //       console.log('EventSource opened.');
  //     };
  //
  //     return () => {
  //       eventSource.close();
  //     };
  //   });
  // }
}
