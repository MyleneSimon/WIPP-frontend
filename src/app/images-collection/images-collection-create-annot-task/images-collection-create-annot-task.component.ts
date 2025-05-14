import {Component} from '@angular/core';
import {MessageService} from 'primeng/api';
import {DialogService, DynamicDialogComponent, DynamicDialogRef} from 'primeng/dynamicdialog';
import {ImagesCollectionService} from '../images-collection.service';
import {Router} from '@angular/router';
import {Image} from '../image';
import {ImagesCollection} from '../images-collection';
import {Label, MaskType} from '../../image-annotations/image-annotation';
import {ImageAnnotationsService} from '../../image-annotations/image-annotations.service';
import {ImageAnnotationsCollection} from '../../image-annotations/image-annotations-collection';
import {AutoCompleteCompleteEvent} from 'primeng/autocomplete';
import {environment} from '../../../environments/environment';
import {KeycloakService} from '../../services/keycloak/keycloak.service';

@Component({
  selector: 'app-images-collection-create-annot-task',
  templateUrl: './images-collection-create-annot-task.component.html',
  styleUrl: './images-collection-create-annot-task.component.css',
  providers: [MessageService]
})
export class ImagesCollectionCreateAnnotTaskComponent {

  instance: DynamicDialogComponent | undefined;

  imageAnnotationsCollection: ImageAnnotationsCollection = new ImageAnnotationsCollection();

  imagesCollectionId: string;
  imagesCollection: ImagesCollection;

  labels: Label[] = [];
  availableImages: Image[];
  selectedImages: Image[];

  masksCollection: ImagesCollection;
  availableMasksCollections: Array<ImagesCollection>;

  useTiling: boolean = false;
  tileSize: number;
  tileOverlap: number;

  userAssignees: string[] = [];
  segmentSize: number;

  maskType: MaskType = MaskType.GRAYSCALE_BINARY;

  resultsLengthImages = 0;

  allImagesSelected: boolean = false;

  labelAddDisplay: boolean = true;
  labelName: string = '';
  labelColor: string = '#b3b3b3';

  private annotationPlatformUrl = environment.cvatRootUrl;

  constructor(public modalReference: DynamicDialogRef,
              private messageService: MessageService,
              private dialogService: DialogService,
              private imageAnnotationsService: ImageAnnotationsService,
              private imagesCollectionService: ImagesCollectionService,
              private router: Router,
              private keycloakService: KeycloakService) {
    this.instance = this.dialogService.getInstance(this.modalReference);
    this.userAssignees = [ this.keycloakService.getUsername() ];
  }

  ngOnInit() {
    if (this.instance && this.instance.data) {
      this.imagesCollectionId = this.instance.data['imagesCollectionId'];
      this.imagesCollectionService.getById(this.imagesCollectionId).subscribe(result => {
        this.imagesCollection = result;
        this.imageAnnotationsCollection.name = this.imagesCollection.name + "-annot";
        this.loadImages();
      });
    }
  }

  loadImages() {
    this.imagesCollectionService.getAllImagesList(this.imagesCollection).subscribe(val => {
      this.availableImages = val;
    });
  }

  cancel() {
    this.modalReference.close();
  }

  postConfiguration() {
    this.messageService.add({ severity: 'info', summary: 'Creating task', detail: "Setting up annotation task, please wait..." });
    this.imageAnnotationsService.setupAnnotationTask(this.imageAnnotationsCollection.name, this.labels, this.segmentSize)
      .subscribe(result => {
        let taskId = result.task_id;
        this.imageAnnotationsCollection.taskId = taskId;
        this.imageAnnotationsCollection.labels = this.labels;
        this.imageAnnotationsCollection.imagesCollectionId = this.imagesCollectionId;
        if (this.masksCollection) {
          this.imageAnnotationsCollection.startMaskCollectionId = this.masksCollection.id;
        }
        this.imageAnnotationsService.createAnnotationsCollection(this.imageAnnotationsCollection).subscribe(annotCollection => {
          let annotationList = [];
          for (let selectedImg of this.selectedImages) {
            let imageMask = null;
            if (annotCollection.startMaskCollectionId) {
              imageMask = {
                imageCollectionId: annotCollection.startMaskCollectionId,
                imageFileName: selectedImg.fileName
              }
            }
            annotationList.push({
              imageFileName: selectedImg.fileName,
              imagesCollectionId: this.imagesCollectionId,
              imageAnnotationsCollection: annotCollection.id,
              pending: true,
              imageMask: imageMask
            });
          }
          let tiling = {};
          if (this.useTiling) {
            tiling = [1, [this.tileSize, this.tileSize], this.tileOverlap, 1];
          }
          if (this.labels?.length > 1) {
            this.maskType = MaskType.GRAYSCALE_CLASS_ID;
          }
          this.imageAnnotationsService.addAnnotations(annotCollection, annotationList).subscribe();
          this.imageAnnotationsService.uploadToAnnotationTask(annotationList, taskId, this.userAssignees, this.maskType, tiling).subscribe(result => {
              this.messageService.add({ severity: 'success', summary: 'Success', detail: "Annotation task created. Opening CVAT in new tab..." })
              window.open(this.annotationPlatformUrl + '/tasks/' + taskId, "_blank");
              this.modalReference.close();
          }, error => {
            this.messageService.add({ severity: 'error', summary: 'Error while creating annotation jobs', detail: error.error, life: 10000 });
            }
          );
        });
      }, error => {
        this.messageService.add({ severity: 'error', summary: 'Error while creating annotation collection', detail: error.error, life: 10000 });
      });
  }

  addLabel() {
    this.labels.push({ name: this.labelName, color: this.labelColor});
    this.resetLabelForm();
  }

  resetLabelForm() {
    this.labelAddDisplay = true;
    this.labelName = '';
    this.labelColor = '#b3b3b3';
  }

  removeLabel(label: Label) {
    this.labels.splice(this.labels.indexOf(label),1);
  }

  filterImgColl(event: AutoCompleteCompleteEvent) {
    this.imagesCollectionService.getByNameContainingIgnoreCase(null, event.query).subscribe(result => {
      this.availableMasksCollections = result.data;
    });
  }
}
