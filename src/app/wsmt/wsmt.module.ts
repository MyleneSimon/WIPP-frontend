import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {WsmtDirective} from './wsmt.directive';

@NgModule({
  declarations: [
    WsmtDirective
  ],
  imports: [
    CommonModule
  ],
  exports: [
    WsmtDirective
  ]
})
export class WsmtModule { }
