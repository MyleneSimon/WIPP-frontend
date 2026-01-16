import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormsModule} from '@angular/forms';
import {PanelModule} from 'primeng/panel';
import {InputTextModule} from 'primeng/inputtext';
import {ButtonModule} from 'primeng/button';
import {InputTextareaModule} from 'primeng/inputtextarea';
import {MarkdownModule} from 'ngx-markdown';



@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    FormsModule,
    PanelModule,
    InputTextModule,
    ButtonModule,
    InputTextareaModule,
    MarkdownModule
  ]
})
export class AiAssistantModule { }
