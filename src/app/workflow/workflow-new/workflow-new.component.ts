import {Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
import {NgbActiveModal, NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {Workflow} from '../workflow';
import {WorkflowService} from '../workflow.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-workflow-new',
  templateUrl: './workflow-new.component.html',
  styleUrls: ['./workflow-new.component.css']
})
export class WorkflowNewComponent implements OnInit {

  @Input() modalReference: any;
  workflow: Workflow = new Workflow();
  cwlFile: File;
  isCopy = false;
  isCwlImport = false;
  fileMaxSizeBytes = 5000000;

  @ViewChild('browseBtn') browseBtn: ElementRef;
  @ViewChild('file') file: ElementRef;

  displayAlert = false;
  alertMessage = '';
  alertType = '';

  constructor(private activeModal: NgbActiveModal, private modalService: NgbModal,
              private workflowService: WorkflowService,
              private router: Router) { }

  ngOnInit() {
  }

  onFileSelected(event) {
    const fileSize = event.target.files[0].size;
    if (fileSize <= this.fileMaxSizeBytes) {
      this.displayAlert = false;
      this.cwlFile = event.target.files[0];
    } else {
      this.displayAlertMessage('danger', 'Cannot upload CWL descriptor. ' + 'The size of the chosen file is ' + fileSize +
        ' B . The maximum size allowed is 5MB ( 5 000 000 B)');
      this.file.nativeElement.value = '';
      this.cwlFile = null;
    }
  }

  cancel() {
    this.modalReference.dismiss();
  }

  save() {
    if (this.isCwlImport) {
      this.workflowService.importFromCwl(this.workflow, this.cwlFile)
        .subscribe(
          workflow => {
            this.displayAlertMessage('success', 'Success! Redirecting...');
            const workflowId = workflow.id ? workflow.id : null;
            setTimeout(() => {
              this.router.navigate(['workflows/detail', workflowId]);
            }, 2000);
          },
          err => {
            this.displayAlertMessage('danger', 'Could not import workflow: ' + err.error);
          });
    } else {
      this.modalReference.close(this.workflow);
    }
  }

  displayAlertMessage(type, message) {
    this.alertMessage = message;
    this.alertType = type;
    this.displayAlert = true;
  }

}
