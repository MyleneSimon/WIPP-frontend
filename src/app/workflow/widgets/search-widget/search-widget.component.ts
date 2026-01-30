import {Component, Injector, ViewChild} from '@angular/core';
import {StringWidget} from 'ngx-schema-form';
import {WorkflowService} from '../../workflow.service';
import {Observable} from 'rxjs';
import {debounceTime, distinctUntilChanged, map, switchMap} from 'rxjs/operators';
import {dataMap} from '../../../data-service';
import { AutoCompleteCompleteEvent, AutoCompleteModule } from 'primeng/autocomplete';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
    selector: 'app-search-widget',
    templateUrl: './search-widget.component.html',
    styleUrls: ['./search-widget.component.css'],
    standalone: true,
    imports: [AutoCompleteModule, FormsModule, ReactiveFormsModule]
})
export class SearchWidgetComponent extends StringWidget {

  public data: Array<any>;
  public service: any;

  constructor(
    private workflowService: WorkflowService,
    private injector: Injector
  ) {
    super();
  }

  filter(event: AutoCompleteCompleteEvent) {
    if (this.schema === null || this.schema.format === null) {
      return [];
    }

    const injectable = dataMap.get(this.schema.format);
    this.service = this.injector.get(injectable);
    this.service.getByNameContainingIgnoreCase(null, event.query).subscribe(result => {
      let collections = this.schema.getOutputs();
      this.data = collections.concat(result['data']);
    });
  }
}
