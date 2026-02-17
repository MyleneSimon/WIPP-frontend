import { Component, OnInit } from '@angular/core';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';

export interface IdHash {
  [nameId: string]: string;
}

@Component({
    selector: 'app-ai-model-card-detail',
    templateUrl: './ai-model-card-detail.component.html',
    styleUrls: ['./ai-model-card-detail.component.css'],
    standalone: false
})

export class AiModelCardDetailComponent implements OnInit {

  aiModelId: string;
  content: string;

  constructor(
    public modalReference: DynamicDialogRef,
    private config: DynamicDialogConfig
  ) {
  }

  ngOnInit() {
    const data = this.config.data as { aiModelId: string; content: string };
    this.aiModelId = data.aiModelId;
    this.content = data.content;
  }
}
