import {Component, Input} from '@angular/core';
import {DynamicDialogConfig, DynamicDialogRef} from 'primeng/dynamicdialog';
import { Button } from 'primeng/button';

@Component({
    selector: 'app-modal-error',
    templateUrl: './modal-error.component.html',
    styleUrls: ['./modal-error.component.css'],
    imports: [Button]
})
export class ModalErrorComponent {
  message: string = '';

  constructor(public modalReference: DynamicDialogRef,  private config: DynamicDialogConfig) {
  }

  ngOnInit() {
    const data = this.config.data as { message?: string };
    this.message = data.message ?? '';
  }

  close() {
    this.modalReference.close();
  }
}

