import { Component } from '@angular/core';
import {DialogService} from 'primeng/dynamicdialog';
import {MessageService} from 'primeng/api';
import {ActivatedRoute, Router} from '@angular/router';
import {KeycloakService} from '../../services/keycloak/keycloak.service';
import {IterativeTrainingPipeline} from '../iterative-training-pipeline';
import {IterativeTrainingPipelineService} from '../iterative-training-pipeline.service';
import {ImagesCollectionService} from '../../images-collection/images-collection.service';
import {ImagesCollection} from '../../images-collection/images-collection';
import {ImageAnnotationsService} from '../../image-annotations/image-annotations.service';
import {environment} from '../../../environments/environment';

@Component({
  selector: 'app-iterative-training-pipeline-detail',
  templateUrl: './iterative-training-pipeline-detail.component.html',
  styleUrl: './iterative-training-pipeline-detail.component.css',
  providers: [DialogService, MessageService]
})
export class IterativeTrainingPipelineDetailComponent {
  iterativeTrainingPipeline: IterativeTrainingPipeline = new IterativeTrainingPipeline();
  resultsLength = 0;
  pageSize = 20;
  iterativeTrainingPipelineId = this.route.snapshot.paramMap.get('id');
  groundTruthCollection: ImagesCollection = null;
  trainingCollection: ImagesCollection = null;

  private annotationPlatformUrl = environment.cvatRootUrl;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private dialogService: DialogService,
    private messageService: MessageService,
    private iterativeTrainingPipelineService: IterativeTrainingPipelineService,
    private imagesCollectionService: ImagesCollectionService,
    private imageAnnotationsService: ImageAnnotationsService,
    private keycloakService: KeycloakService
  ) {
  }

  ngOnInit() {
    this.iterativeTrainingPipelineService.getById(this.iterativeTrainingPipelineId)
      .subscribe(iterativeTrainingPipeline => {
        this.iterativeTrainingPipeline = iterativeTrainingPipeline;
        this.getCollections();
      }, error => {
        this.router.navigate(['/404']);
      });
  }

  makePublic(): void {
    this.iterativeTrainingPipelineService.makePublicPipeline(
      this.iterativeTrainingPipeline).subscribe(iterativeTrainingPipeline => {
      this.iterativeTrainingPipeline = iterativeTrainingPipeline;
    });
  }

  canEdit(): boolean {
    return this.keycloakService.canEdit(this.iterativeTrainingPipeline);
  }

  getCollections() {
    if(this.iterativeTrainingPipeline.trainingCollection) {
      this.imagesCollectionService.getById(this.iterativeTrainingPipeline.trainingCollection).subscribe(
        collection => this.trainingCollection = collection);
    }
    if(this.iterativeTrainingPipeline.groundTruthCollection) {
      this.imagesCollectionService.getById(this.iterativeTrainingPipeline.groundTruthCollection).subscribe(
        collection => this.groundTruthCollection = collection);
    }
  }

  newIteration() {
    // call add iteration, display loading message
    this.messageService.add({ severity: 'info', summary: 'Loading...', detail: "Setting up new iteration..." });
    this.iterativeTrainingPipelineService.addIteration(
      this.iterativeTrainingPipeline).subscribe(iterativeTrainingPipeline => {
      this.iterativeTrainingPipeline = iterativeTrainingPipeline;
      let annotCollectionId = iterativeTrainingPipeline.iterations
        .find(({iterationNumber}) => iterationNumber === iterativeTrainingPipeline.currentIteration)
        .imageAnnotationsCollection;
      this.imageAnnotationsService.getById(annotCollectionId).subscribe(annotCollection => {
        this.imageAnnotationsService.getAllAnnotationsList(annotCollection).subscribe(annotations => {
          let annotationList = [];
          for (let selectedImg of annotations) {
            let imageMask = null;
            if (annotCollection.startMaskCollectionId) {
              imageMask = {
                imagesCollectionId: annotCollection.startMaskCollectionId,
                imageFileName: selectedImg.imageFileName
              }
            }
            annotationList.push({
              imageFileName: selectedImg.imageFileName,
              imagesCollectionId: iterativeTrainingPipeline.trainingCollection,
              imageAnnotationsCollection: annotCollection.id,
              pending: true,
              imageMask: imageMask
            });
          }
          // setup annotation task, display loading message
          this.messageService.add({ severity: 'info', summary: 'Loading...', detail: "Creating annotation task..." });
          this.imageAnnotationsService.setupAnnotationTask(annotCollection.name, this.iterativeTrainingPipeline.labels, null)
            .subscribe(result => {
              let taskId = result.task_id;
              this.imageAnnotationsService.updateCollectionTaskId(annotCollection, taskId).subscribe();
              this.imageAnnotationsService.uploadToAnnotationTask(annotationList, taskId, []).subscribe(result => {
                this.messageService.add({severity: 'success', summary: 'Success', detail: "Annotation task created. Opening CVAT in new tab..."
                })
                window.open(this.annotationPlatformUrl + '/tasks/' + taskId, "_blank");
              }, error => {
                console.log(error);
                this.messageService.add({severity: 'error', summary: 'Error', detail: "Error while creating annotation jobs " + error.error});
              });
            }, error => {
              this.messageService.add({severity: 'error', summary: 'Error', detail: "Error while creating annotation task " + error.error});
            });
        });
      });
    },error => {
        console.log(error);
      this.messageService.add({ severity: 'error', summary: 'Unable to create new iteration', detail: error.error });
    });

  }

  ngOnDestroy() {
    this.dialogService.dialogComponentRefMap.forEach((dialog) => dialog.destroy());
  }
}
