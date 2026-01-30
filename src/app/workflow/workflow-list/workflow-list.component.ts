import { Component } from '@angular/core';
import {WorkflowService} from '../workflow.service';
import {Workflow} from '../workflow';
import {WorkflowNewComponent} from '../workflow-new/workflow-new.component';
import {KeycloakService} from '../../services/keycloak/keycloak.service';
import {DialogService} from 'primeng/dynamicdialog';
import { MessageService, PrimeTemplate } from 'primeng/api';
import { TableModule } from 'primeng/table';
import { NgIf, DatePipe } from '@angular/common';
import { Button } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { RouterLink } from '@angular/router';
import { TagModule } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';

@Component({
    selector: 'app-workflow-list',
    templateUrl: './workflow-list.component.html',
    styleUrls: ['./workflow-list.component.css'],
    providers: [DialogService, MessageService],
    standalone: true,
    imports: [TableModule, PrimeTemplate, NgIf, Button, InputTextModule, RouterLink, TagModule, ToastModule, DatePipe]
})
export class WorkflowListComponent {
  workflows: Workflow[];
  resultsLength = 0;
  pageSize = 10;

  constructor(
    private workflowService: WorkflowService,
    private keycloakService: KeycloakService,
    private dialogService: DialogService,
  ) {
  }

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
    if(event.filters?.global?.value) {
      this.workflowService.getWorkflowsByNameContainingIgnoreCase(params, event.filters.global.value).subscribe(result => {
        this.workflows = result.workflows;
        this.resultsLength = result.page.totalElements;
      });
    } else {
      this.workflowService.getWorkflows(params).subscribe(result => {
        this.workflows = result.workflows;
        this.resultsLength = result.page.totalElements;
      });
    }
  }

  createNew() {
    let modalRef = this.dialogService.open(WorkflowNewComponent, {
      header: 'New workflow',
      position: 'top',
      width: '50vw',
      breakpoints: {
        '960px': '75vw',
        '640px': '90vw'
      }
    });
  }

  canCreate(): boolean {
    return(this.keycloakService.isLoggedIn());
  }

  getIconByWorkflowStatus(workflow: Workflow) {
    return this.workflowService.getIconByWorkflowStatus(workflow);
  }

  ngOnDestroy() {
    this.dialogService.dialogComponentRefMap.forEach((dialog) => dialog.destroy());
  }
}
