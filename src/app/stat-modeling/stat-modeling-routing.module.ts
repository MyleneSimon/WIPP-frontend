import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {StatModelingListComponent} from './stat-modeling-list/stat-modeling-list.component';
import {StatModelingDetailComponent} from './stat-modeling-detail/stat-modeling-detail.component';

const statModelingRoutes: Routes = [
  { path: 'stat-modelings', component: StatModelingListComponent },
  { path: 'stat-modelings/:id', component: StatModelingDetailComponent }
];

@NgModule({
  imports: [
    RouterModule.forChild(statModelingRoutes)
  ],
  exports: [
    RouterModule
  ]
})

export class StatModelingRoutingModule {}

