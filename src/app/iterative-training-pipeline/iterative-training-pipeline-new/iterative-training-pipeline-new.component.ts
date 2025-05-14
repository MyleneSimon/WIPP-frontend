import {Component} from '@angular/core';
import {MessageService} from 'primeng/api';
import {DynamicDialogRef} from 'primeng/dynamicdialog';
import {Router} from '@angular/router';
import {IterativeTrainingPipeline, TaskCategory} from '../iterative-training-pipeline';
import {IterativeTrainingPipelineService} from '../iterative-training-pipeline.service';
import {Label} from '../../image-annotations/image-annotation';
import {AutoCompleteCompleteEvent} from 'primeng/autocomplete';
import {ImagesCollection, ImagesCollectionImportMethod} from '../../images-collection/images-collection';
import {ImagesCollectionService} from '../../images-collection/images-collection.service';

@Component({
  selector: 'app-iterative-training-pipeline-new',
  templateUrl: './iterative-training-pipeline-new.component.html',
  styleUrl: './iterative-training-pipeline-new.component.css',
  providers: [MessageService]
})
export class IterativeTrainingPipelineNewComponent {

  iterativeTrainingPipeline: IterativeTrainingPipeline = new IterativeTrainingPipeline();
  defaultTaskCategory = 'SEGMENTATION';
  labelAddDisplay: boolean = true;
  labelName: string = '';
  labelColor: string = '#b3b3b3';
  availableCollections: Array<ImagesCollection>;
  availableTemplates: [];

  constructor(public modalReference: DynamicDialogRef,
              private messageService: MessageService,
              private iterativeTrainingPipelineService: IterativeTrainingPipelineService,
              private imagesCollectionService: ImagesCollectionService,
              private router: Router) {
    this.iterativeTrainingPipeline.workflowTemplate = "WIPP U-NET";
    this.iterativeTrainingPipeline.taskCategory = TaskCategory.SEGMENTATION;
  }

  create() {
    let groundTruthCollection: ImagesCollection = new ImagesCollection();
    groundTruthCollection.name = this.iterativeTrainingPipeline.name + '-groundTruth';
    groundTruthCollection.importMethod = ImagesCollectionImportMethod.ANNOT;
    this.messageService.add({ severity: 'info', summary: 'In progress', detail: "Setting up ground truth collection..." });
    this.imagesCollectionService.createImagesCollection(groundTruthCollection).subscribe(collection =>
    {
      this.iterativeTrainingPipeline.groundTruthCollection = collection.id;
      this.iterativeTrainingPipelineService.createIterativeTrainingPipeline(this.iterativeTrainingPipeline).subscribe(
        iterativeTrainingPipeline => {
          this.messageService.add({ severity: 'success', summary: 'Success', detail: "Pipeline created. Redirecting..." });
          const iterativeTrainingPipelineId = iterativeTrainingPipeline ? iterativeTrainingPipeline.id : null;
          setTimeout(() => {
            this.router.navigate(['iterative-training-pipelines', iterativeTrainingPipelineId]);
          }, 2000);
        },
        err => {
          // delete ground truth collection if pipeline creation in non successful
          this.imagesCollectionService.deleteImagesCollection(collection).subscribe();
          this.messageService.add({ severity: 'error', summary: 'Unable to create pipeline', detail: err.error });
        });
    },
    err => {
      this.messageService.add({ severity: 'error', summary: 'Unable to create ground truth collection', detail: err.error });
    });

  }

  addLabel() {
    this.iterativeTrainingPipeline.labels.push({ name: this.labelName, color: this.labelColor});
    console.log(this.iterativeTrainingPipeline.labels);
    this.resetLabelForm();
  }

  resetLabelForm() {
    this.labelAddDisplay = true;
    this.labelName = '';
    this.labelColor = '#b3b3b3';
  }

  removeLabel(label: Label) {
    this.iterativeTrainingPipeline.labels.splice(this.iterativeTrainingPipeline.labels.indexOf(label),1);
  }

  filterImgColl(event: AutoCompleteCompleteEvent) {
    this.imagesCollectionService.getByNameContainingIgnoreCase(null, event.query).subscribe(result => {
      this.availableCollections = result.data;
    });
  }

  cancel() {
    this.modalReference.close();
  }

}
