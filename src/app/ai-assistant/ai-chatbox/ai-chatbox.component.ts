import {Component, ElementRef, ViewChild} from '@angular/core';
import {AiAssitantService} from '../ai-assitant.service';
import {Panel, PanelModule} from 'primeng/panel';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {InputTextModule} from 'primeng/inputtext';
import {ButtonModule} from 'primeng/button';
import {InputTextareaModule} from 'primeng/inputtextarea';
import {MarkdownModule, MarkdownService, provideMarkdown} from 'ngx-markdown';

interface Message {
  text: string;
  sender: string;
}

@Component({
  selector: 'app-ai-chatbox',
  standalone: true,
  imports: [CommonModule,
    FormsModule,
    PanelModule,
    InputTextModule,
    ButtonModule,
    InputTextareaModule,
  MarkdownModule],
  providers: [provideMarkdown()],
  templateUrl: './ai-chatbox.component.html',
  styleUrl: './ai-chatbox.component.css'
})
export class AiChatboxComponent {

  @ViewChild('chatContainer') chatContainer: ElementRef;

  constructor(private aiAssistantService: AiAssitantService) {
    this.conversationId = crypto.randomUUID();
    this.messages.push({ text: "Hello! I am the WIPP AI Assistant, how can I help you?", sender: 'WIPP' });
  }

  messages: Message[] = [];
  newMessage = '';
  conversationId;
  lastMessage: any;

  sendMessage() {
    if (this.newMessage.trim()) {
      this.messages.push({ text: this.newMessage, sender: 'me' });
      setTimeout(() => {
        this.scrollToBottom();
      });
      this.aiAssistantService.chat(this.conversationId, this.newMessage).subscribe(
        result => this.messages.push(
        { text: result, sender: 'WIPP' }),
        error =>
        {this.messages.push({ text: "Assistant could not answer.", sender: 'WIPP' })},
        () => setTimeout(() => {
          this.scrollToBottom();
        }));
      this.newMessage = '';
      // this.aiAssistantService.chat(this.conversationId, this.newMessage).subscribe((response) => {
      //   console.log(response);
      //   console.log(this.lastMessage);
      //   if (!this.lastMessage || this.lastMessage.sender !== 'WIPP') {
      //     this.lastMessage = { text: response, sender: 'WIPP' };
      //     this.messages.push(this.lastMessage);
      //   } else {
      //     this.lastMessage.text += ' ' + response;
      //   }
      // }, (error) => {
      //   console.error('Error:', error);
      // });
      // this.newMessage = '';
    }

  }

  scrollToBottom() {
    if (this.chatContainer) {
      const container = this.chatContainer.nativeElement;
      container.scrollTo({
        top: container.scrollHeight,
        behavior: 'smooth'
      });
    }
  }

}
