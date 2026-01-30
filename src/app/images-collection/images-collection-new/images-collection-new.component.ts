import { Component, OnInit } from '@angular/core';
import {ImagesCollection, ImagesCollectionImportMethod} from '../images-collection';
import {AppConfigService} from '../../app-config.service';
import {DynamicDialogRef} from 'primeng/dynamicdialog';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { RadioButtonModule } from 'primeng/radiobutton';
import { TooltipModule } from 'primeng/tooltip';
import { NgIf, NgTemplateOutlet } from '@angular/common';
import { CheckboxModule } from 'primeng/checkbox';
import { Button } from 'primeng/button';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { ToastModule } from 'primeng/toast';

@Component({
    selector: 'app-images-collection-new',
    templateUrl: './images-collection-new.component.html',
    styleUrls: ['./images-collection-new.component.css'],
    standalone: true,
    imports: [FormsModule, InputTextModule, RadioButtonModule, TooltipModule, NgIf, CheckboxModule, Button, OverlayPanelModule, NgTemplateOutlet, ToastModule]
})
export class ImagesCollectionNewComponent implements OnInit {

  imagesCollection: ImagesCollection = new ImagesCollection();
  usePattern = false;
  ImagesCollectionImportMethod = ImagesCollectionImportMethod;
  displayLocalImportOption = false;

  constructor(public modalReference: DynamicDialogRef, private appConfigService: AppConfigService) {
    if (this.appConfigService.getConfig().displayLocalImportOption) {
      this.displayLocalImportOption = true;
    }
  }

  ngOnInit() {
    this.imagesCollection.importMethod = ImagesCollectionImportMethod.UPLOADED;
  }
  cancel() {
    this.modalReference.close();
  }
  save() {
    this.modalReference.close(this.imagesCollection);
  }

}
