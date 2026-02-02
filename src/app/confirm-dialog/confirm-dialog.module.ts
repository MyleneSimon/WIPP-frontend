import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ConfirmDialogComponent} from './confirm-dialog.component';
import {DialogService} from 'primeng/dynamicdialog';
import {MessagesModule} from 'primeng/messages';
import {ButtonModule} from 'primeng/button';

@NgModule({
    imports: [
        CommonModule,
        MessagesModule,
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
