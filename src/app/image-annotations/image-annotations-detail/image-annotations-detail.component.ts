import {Component, NgZone} from '@angular/core';
import {Job} from '../../job/job';
import {ActivatedRoute, Router} from '@angular/router';
import {DialogService} from 'primeng/dynamicdialog';
import {KeycloakService} from '../../services/keycloak/keycloak.service';
import {JobDetailComponent} from '../../job/job-detail/job-detail.component';
import {ImageAnnotationsCollection} from '../image-annotations-collection';
import {ImageAnnotation} from '../image-annotation';
import {ImageAnnotationsService} from '../image-annotations.service';
import {MessageService} from 'primeng/api';
import {AppConfigService} from '../../app-config.service';
import OpenSeadragon from 'openseadragon';
import {environment} from '../../../environments/environment';
import * as Annotorious from '@recogito/annotorious-openseadragon';
import ShapeLabelsFormatter from '@recogito/annotorious-shape-labels'
import {ConfirmDialogService} from '../../confirm-dialog/confirm-dialog.service';
import {saveAs} from 'file-saver';

@Component({
  selector: 'app-image-annotations-detail',
  templateUrl: './image-annotations-detail.component.html',
  styleUrl: './image-annotations-detail.component.css',
  providers: [DialogService, MessageService]
})
export class ImageAnnotationsDetailComponent {

  imageAnnotationsCollection: ImageAnnotationsCollection = new ImageAnnotationsCollection();
  annotations: ImageAnnotation[] = [];
  resultsLength = 0;
  pageSize = 20;
  job: Job = null;
  cvatUrl = environment.cvatRootUrl + '/tasks';

  iipRootUrl: string = environment.iipRootUrl;
  dzvVisible: boolean = false;
  displayMask: boolean = false;
  selectedImageAnnot: ImageAnnotation = undefined;
  osdViewer: OpenSeadragon.Viewer | undefined;

  imageAnnotationsCollectionId = this.route.snapshot.paramMap.get('id');

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private dialogService: DialogService,
    private messageService: MessageService,
    private imageAnnotationsService: ImageAnnotationsService,
    private keycloakService: KeycloakService,
    private confirmDialogService: ConfirmDialogService,
    private ngZone: NgZone
  ) {
  }

  ngOnInit() {
    this.imageAnnotationsService.getById(this.imageAnnotationsCollectionId)
      .subscribe(imageAnnotationsCollection => {
        this.imageAnnotationsCollection = imageAnnotationsCollection;
        this.getAnnotations(null);
        this.getJob();
      }, error => {
        this.router.navigate(['/404']);
      });
  }

  getAnnotations(event): void {
    const sortField = event?.sortField ? event.sortField : 'fileName,asc';
    const pageIndex = event ? event.first / event.rows : 0;
    const pageSize = event ? event.rows : this.pageSize;
    const params = {
      pageIndex: pageIndex,
      size: pageSize,
      sort: sortField
    };
    this.imageAnnotationsService.getAnnotations(this.imageAnnotationsCollectionId, params).subscribe(paginatedResult => {
      this.resultsLength = paginatedResult.page.totalElements;
      this.annotations = paginatedResult.data;
    });
  }

  getJob() {
    if (this.imageAnnotationsCollection._links['job']) {
      this.imageAnnotationsService.getJob(this.imageAnnotationsCollection._links['job']['href']).subscribe(job => this.job = job);
    }
  }

  displayJobModal(jobId: string) {
    this.dialogService.open(JobDetailComponent, {
      header: 'Job detail',
      position: 'top',
      width: '50vw',
      data: {
        jobId: jobId
      },
      breakpoints: {
        '960px': '75vw',
        '640px': '90vw'
      }
    });
  }

  openDeepZoomImage(annotation: ImageAnnotation, displayMask: boolean): void {
    this.dzvVisible = true;
    this.selectedImageAnnot = annotation;
    this.displayMask = displayMask;
  }

  displayDeepZoomImage() {
    let imageToDisplay = this.imageAnnotationsCollection.imagesCollectionId + '/images/' + this.selectedImageAnnot.imageFileName + '/info.json';
    if (this.displayMask == true) {
      imageToDisplay = this.selectedImageAnnot.imageMask.imagesCollectionId + '/images/' + this.selectedImageAnnot.imageMask.imageFileName + '/info.json';
    }
    this.ngZone.runOutsideAngular(() => {
      this.osdViewer = OpenSeadragon({
        id: 'openseadragon-img',
        prefixUrl: "https://cdn.jsdelivr.net/npm/openseadragon@4.1/build/openseadragon/images/",
        tileSources: [
          this.iipRootUrl
          + '?CNT=STRETCH'
          + '&IIIF='
          + imageToDisplay
        ]
      });

      let formatter = function(annotation) {
        const tag = annotation.bodies.find(b => b.purpose === 'tagging');
        if (tag && tag.color)
          return {
          style: `stroke:${tag.color}; fill:${tag.color}`
        }
      }

      const config = {
        formatters: [formatter, ShapeLabelsFormatter()],
        widgets: ['TAG']
      };
      var anno = Annotorious(this.osdViewer, config);
      anno.readOnly = true;
      if (!this.displayMask) {
        this.imageAnnotationsService.downloadAnnotationFile(
          this.imageAnnotationsCollection, this.selectedImageAnnot.annotoriousFileName).subscribe(
          annotation => {
            console.log(annotation);
            for(let i = 0; i < annotation.length; i++)
              anno.addAnnotation(annotation[i]);
            console.log(anno);
          },
          err => {
            console.log('no annotations found');
          });
      }
    });
  }

  closeDeepZoomImage() {
    if(this.osdViewer)
      this.osdViewer.destroy();
  }

  openDownload(url: string) {
    this.imageAnnotationsService.startDownload(url).subscribe(downloadUrl =>
      window.location.href = downloadUrl['url']);
  }

  downloadAnnotFile(fileName: string) {
    this.imageAnnotationsService.downloadAnnotationFile(
      this.imageAnnotationsCollection, fileName).subscribe(
      annotation => {
        // Stringify the JSON object
        const jsonString = JSON.stringify(annotation);
        const blob =
          new Blob([jsonString], { type: "application/json" });
        saveAs(blob, fileName);
      });
  }

  deleteCollection(): void {
    const title = 'Delete collection';
    const message = 'Are you sure you want to delete the collection ' +
      this.imageAnnotationsCollection.name + '? ' +
      'This action cannot be undone.';
    const warnings: string[] = [];
    if (this.imageAnnotationsCollection.publiclyShared) {
      warnings.push('This collection is public, multiple users may be impacted.');
    }
    const modalRefConfirm = this.confirmDialogService.createConfirmModal(
      title, message, warnings
    );
    modalRefConfirm.onClose.subscribe((confirm) => {
      if (confirm) {
        this.imageAnnotationsService.deleteAnnotationsCollection(this.imageAnnotationsCollection).subscribe(collection => {
          this.router.navigate(['image-annotations']);
        });
      }
    });
  }

  canEdit(): boolean {
    return this.keycloakService.canEdit(this.imageAnnotationsCollection);
  }

  canDeletePublicData(): boolean {
    return this.keycloakService.canDeletePublicData();
  }

  makePublicCollection(): void {
    const title = 'Make public';
    const message = 'Are you sure you want to make this collection public? ' +
      'This action cannot be undone.';
    const warnings: string[] = [];
    warnings.push('Once public, all users will be able to see and use the collection.');
    warnings.push('Once public, the collection cannot be deleted except by an admin user.');
    const modalRefConfirm = this.confirmDialogService.createConfirmModal(
      title, message, warnings
    );
    modalRefConfirm.onClose.subscribe((confirm) => {
      if (confirm) {
        this.imageAnnotationsService.makePublicCollection(
          this.imageAnnotationsCollection).subscribe(imageAnnotationsCollection => {
          this.imageAnnotationsCollection = imageAnnotationsCollection;
        }, error => {
          this.messageService.add({ severity: 'error', summary: 'Unable to make collection public', detail: error.error });
        });
      }
    });
  }

  ngOnDestroy() {
    this.dialogService.dialogComponentRefMap.forEach((dialog) => dialog.destroy());
  }
}
