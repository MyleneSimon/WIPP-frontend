import { Component, OnInit } from '@angular/core';
import {DynamicComponent} from '../../dynamic-content/dynamic.component';
import {PyramidService} from '../pyramid.service';
import { RouterLink } from '@angular/router';

@Component({
    selector: 'app-pyramid-template',
    template: ' <a routerLink="/pyramids/{{idData}}">{{text}}</a>',
    imports: [RouterLink]
})
export class PyramidTemplateComponent extends DynamicComponent implements OnInit {

    constructor(
    private pyramidService: PyramidService) {
    super();
}

static key = 'pyramidtemplatecomponent';

  ngOnInit() {
      this.pyramidService.getById(this.idData).subscribe(result => {
        this.text = result.name;
      });
  }
}
