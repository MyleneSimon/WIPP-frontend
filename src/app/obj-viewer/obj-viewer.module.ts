import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {ObjViewerComponent} from './obj-viewer/obj-viewer.component';
import {ButtonModule} from 'primeng/button';
import {ColorPickerModule} from 'primeng/colorpicker';
import {FormsModule} from '@angular/forms';

@NgModule({
  declarations: [ObjViewerComponent],
  exports: [ObjViewerComponent],
  imports: [
    CommonModule,
    ColorPickerModule,
    ButtonModule,
    FormsModule
  ]
})
export class ObjViewerModule { }
