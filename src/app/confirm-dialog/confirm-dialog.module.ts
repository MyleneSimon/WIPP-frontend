import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ConfirmDialogComponent} from './confirm-dialog.component';
import {DialogService} from 'primeng/dynamicdialog';
import {MessageModule} from 'primeng/message';
import {ButtonModule} from 'primeng/button';

@NgModule({
    imports: [
        CommonModule,
        MessageModule,
        ButtonModule,
        ConfirmDialogComponent
    ],
    providers: [
        DialogService
    ],
    exports: [
        ConfirmDialogComponent
    ]
})
export class ConfirmDialogModule { }
