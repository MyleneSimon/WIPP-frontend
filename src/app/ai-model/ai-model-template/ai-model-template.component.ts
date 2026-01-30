import { Component, OnInit } from '@angular/core';
import { DynamicComponent } from '../../dynamic-content/dynamic.component';
import { AiModelService } from '../ai-model.service';


@Component({
  selector: 'app-ai-model-template',
  template:
    '<a routerLink="/ai-models/{{idData}}">{{text}}</a>'
})
export class AiModelTemplateComponent extends DynamicComponent implements OnInit {

  constructor(private AiModelService: AiModelService) { super(); }

  static key = 'AiModeltemplatecomponent';

  ngOnInit() {
      if (this.idData) {
      this.AiModelService.getById(this.idData).subscribe(result => {
        this.text = result.name;
      });
    }
  }
}
