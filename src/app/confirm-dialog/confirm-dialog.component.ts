import { Component, OnInit } from '@angular/core';
import {DialogService, DynamicDialogComponent, DynamicDialogRef} from 'primeng/dynamicdialog';
import { ToastMessageOptions, PrimeTemplate } from 'primeng/api';
import { NgFor } from '@angular/common';
import { MessagesModule } from 'primeng/messages';
import { Button } from 'primeng/button';

@Component({
    selector: 'app-confirm-dialog',
    templateUrl: './confirm-dialog.component.html',
    styleUrls: ['./confirm-dialog.component.css'],
    imports: [NgFor, MessagesModule, PrimeTemplate, Button]
})
export class ConfirmDialogComponent implements OnInit {

  title: string;
  message: string;
  warnings: string[]
  messages: ToastMessageOptions[] | undefined;

  instance: DynamicDialogComponent | undefined;

  constructor(
    public modalReference: DynamicDialogRef,
    private dialogService: DialogService,
  ) {
    this.instance = this.dialogService.getInstance(this.modalReference);
  }

  ngOnInit() {
    if (this.instance && this.instance.data) {
      this.message = this.instance.data['message'];
      this.warnings = this.instance.data['warnings'];
    }
  }

  onConfirm(): void {
    this.modalReference.close(true);
  }

  onDismiss(): void {
    this.modalReference.close(false);
  }

}
