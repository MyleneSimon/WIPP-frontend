import { Component, OnInit } from '@angular/core';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ToastMessageOptions, PrimeTemplate } from 'primeng/api';
import { NgFor } from '@angular/common';
import { MessageModule } from 'primeng/message';
import { Button } from 'primeng/button';

@Component({
    selector: 'app-confirm-dialog',
    templateUrl: './confirm-dialog.component.html',
    styleUrls: ['./confirm-dialog.component.css'],
    imports: [NgFor, MessageModule, PrimeTemplate, Button]
})
export class ConfirmDialogComponent implements OnInit {

  title: string;
  message: string;
  warnings: string[]
  messages: ToastMessageOptions[] | undefined;

  constructor(
    public modalReference: DynamicDialogRef,
    private config: DynamicDialogConfig,
  ) {
  }

  ngOnInit() {
    const data = this.config.data as { message?: string, warnings?: string[] };
    this.message = data?.message;
    this.warnings = data?.warnings;
  }

  onConfirm(): void {
    this.modalReference.close(true);
  }

  onDismiss(): void {
    this.modalReference.close(false);
  }

}
