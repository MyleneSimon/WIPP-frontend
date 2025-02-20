import { Component } from '@angular/core';
import {DialogService} from 'primeng/dynamicdialog';
import {MessageService} from 'primeng/api';
import {Router} from '@angular/router';
import {KeycloakService} from '../../services/keycloak/keycloak.service';
import {IterativeTrainingPipeline} from '../iterative-training-pipeline';
import {IterativeTrainingPipelineService} from '../iterative-training-pipeline.service';
import {IterativeTrainingPipelineNewComponent} from '../iterative-training-pipeline-new/iterative-training-pipeline-new.component';

@Component({
  selector: 'app-iterative-training-pipeline-list',
  templateUrl: './iterative-training-pipeline-list.component.html',
  styleUrl: './iterative-training-pipeline-list.component.css',
  providers: [DialogService, MessageService]
})
export class IterativeTrainingPipelineListComponent {

  trainingPipelines: IterativeTrainingPipeline[];

  resultsLength = 0;
  pageSize = 10;

  constructor(
    private iterativeTrainingPipelineService: IterativeTrainingPipelineService,
    private router: Router,
    private keycloakService: KeycloakService,
    private dialogService: DialogService
  ) {}

  loadData(event) {
    const sortOrderStr = event?.sortOrder == -1 ? 'desc' : 'asc';
    const sortField = event?.sortField ? event.sortField + ',' + sortOrderStr : 'creationDate,desc';
    const pageIndex = event ? event.first / event.rows : 0;
    const pageSize = event ? event.rows : this.pageSize;
    const params = {
      pageIndex: pageIndex,
      size: pageSize,
      sort: sortField
    };
    if(event?.filters?.global?.value) {
      this.iterativeTrainingPipelineService.getByNameContainingIgnoreCase(params, event.filters.global.value).subscribe(result => {
        this.trainingPipelines = result.data;
        this.resultsLength = result.page.totalElements;
      });
    } else {
      this.iterativeTrainingPipelineService.get(params).subscribe(result => {
        this.trainingPipelines = result.data;
        this.resultsLength = result.page.totalElements;
      });
    }
  }

  createNew() {
    this.dialogService.open(IterativeTrainingPipelineNewComponent, {
      header: 'New iterative training pipeline',
      position: 'top',
      width: '50vw',
      breakpoints: {
        '960px': '75vw',
        '640px': '90vw'
      }
    });
  }

  canCreate() : boolean {
    return(this.keycloakService.isLoggedIn());
  }

  ngOnDestroy() {
    this.dialogService.dialogComponentRefMap.forEach((dialog) => dialog.destroy());
  }

}
