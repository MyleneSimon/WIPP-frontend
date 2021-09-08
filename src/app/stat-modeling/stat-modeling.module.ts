import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StatModelingDetailComponent } from './stat-modeling-detail/stat-modeling-detail.component';
import { StatModelingListComponent } from './stat-modeling-list/stat-modeling-list.component';
import { StatModelingNewComponent } from './stat-modeling-new/stat-modeling-new.component';
import {MatCheckboxModule, MatFormFieldModule, MatInputModule, MatPaginatorModule, MatSortModule, MatTableModule} from '@angular/material';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {StatModelingRoutingModule} from './stat-modeling-routing.module';
import {WsmtModule} from '../wsmt/wsmt.module';

@NgModule({
  declarations: [
    StatModelingDetailComponent,
    StatModelingListComponent,
    StatModelingNewComponent],
  imports: [
    CommonModule,
    MatPaginatorModule,
    MatTableModule,
    MatSortModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    ReactiveFormsModule,
    MatCheckboxModule,
    StatModelingRoutingModule,
    WsmtModule,
    NgbModule.forRoot()
  ],
  entryComponents: [
    StatModelingNewComponent
  ]
})
export class StatModelingModule { }
