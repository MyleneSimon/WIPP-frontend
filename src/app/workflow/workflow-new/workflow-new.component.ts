import { Component, OnInit } from '@angular/core';
import {Workflow} from '../workflow';
import {DialogService, DynamicDialogComponent, DynamicDialogRef} from 'primeng/dynamicdialog';
import { MessageService, PrimeTemplate } from 'primeng/api';
import {WorkflowService} from '../workflow.service';
import {Router} from '@angular/router';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { NgIf } from '@angular/common';
import { MessagesModule } from 'primeng/messages';
import { TextareaModule } from 'primeng/textarea';
import { Button } from 'primeng/button';
import { ToastModule } from 'primeng/toast';

@Component({
    selector: 'app-workflow-new',
    templateUrl: './workflow-new.component.html',
    styleUrls: ['./workflow-new.component.css'],
    providers: [MessageService],
    imports: [FormsModule, InputTextModule, NgIf, MessagesModule, PrimeTemplate, TextareaModule, Button, ToastModule]
})
export class WorkflowNewComponent implements OnInit {

  instance: DynamicDialogComponent | undefined;

  workflow: Workflow = new Workflow();
  isCopy = false;
  sourceWorkflow: Workflow = undefined;

  constructor(public modalReference: DynamicDialogRef,
              private dialogService: DialogService,
              private messageService: MessageService,
              private workflowService: WorkflowService,
              private router: Router) {
    this.instance = this.dialogService.getInstance(this.modalReference);
  }

  ngOnInit() {
    if (this.instance?.data && this.instance?.data['isCopy']) {
      this.isCopy = this.instance.data['isCopy'];
      this.sourceWorkflow = this.instance.data['sourceWorkflow'];
      this.workflow.name = this.sourceWorkflow.name + "-copy";
      this.workflow.description = this.sourceWorkflow.description;
    }
  }

  cancel() {
    this.modalReference.close();
  }

  save() {
    let serviceCall = this.workflowService.createWorkflow(this.workflow);
    if(this.isCopy) {
      serviceCall = this.workflowService.copyWorkflow(this.sourceWorkflow, this.workflow.name, this.workflow.description);
    }
    serviceCall.subscribe(workflow => {
      this.messageService.add({ severity: 'success', summary: 'Success', detail: "Workflow created. Redirecting..." });
      const workflowId = workflow ? workflow.id : null;
      setTimeout(() => {
        this.router.navigate(['workflows/detail', workflowId]);
      }, 2000);
    }, error => {
      this.messageService.add({ severity: 'error', summary: 'Unable to create workflow', detail: error.error });
    });
  }
}
