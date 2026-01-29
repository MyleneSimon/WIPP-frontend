import { Injectable } from '@angular/core';
import {DataService} from '../data-service';
import {ImageAnnotationsCollection, PaginatedImageAnnotationsCollections} from './image-annotations-collection';
import {environment} from '../../environments/environment';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import {Observable, of} from 'rxjs';
import {map} from 'rxjs/operators';
import {Job} from '../job/job';
import {ImageAnnotation, Label, PaginatedImageAnnotations} from './image-annotation';
import {ImagesCollection} from '../images-collection/images-collection';
import {Image} from '../images-collection/image';


@Injectable({
  providedIn: 'root'
})
export class ImageAnnotationsService implements DataService<ImageAnnotationsCollection, PaginatedImageAnnotationsCollections> {

  private imageAnnotationsCollectionsUrl = environment.apiRootUrl + '/imageAnnotationsCollections';
  private imageAnnotationsApiUrl = environment.annotationApiRootUrl; // Python Annotation API URL

  constructor(
    private http: HttpClient
  ) { }

  get(params): Observable<PaginatedImageAnnotationsCollections> {
    const httpOptions = {
      headers: new HttpHeaders({'Content-Type': 'application/json'}),
      params: {}
    };
    if (params) {
      const page = params.pageIndex ? params.pageIndex : null;
      const size = params.size ? params.size : null;
      const sort = params.sort ? params.sort : null;
      const httpParams = new HttpParams().set('page', page).set('size', size).set('sort', sort);
      httpOptions.params = httpParams;
    }
    return this.http.get<any>(this.imageAnnotationsCollectionsUrl, httpOptions).pipe(
      map((result: any) => {
        result.data = result._embedded.imageAnnotationsCollections;
        return result;
      }));
  }

  getById(id): Observable<ImageAnnotationsCollection> {
    return this.http.get<ImageAnnotationsCollection>(`${this.imageAnnotationsCollectionsUrl}/${id}`);
  }

  getByNameContainingIgnoreCase(params, name): Observable<PaginatedImageAnnotationsCollections> {
    const httpOptions = {
      headers: new HttpHeaders({'Content-Type': 'application/json'}),
      params: {}
    };
    let httpParams = new HttpParams().set('name', name);
    if (params) {
      const page = params.pageIndex ? params.pageIndex : null;
      const size = params.size ? params.size : null;
      const sort = params.sort ? params.sort : null;
      httpParams = httpParams.set('page', page).set('size', size).set('sort', sort);
    }
    httpOptions.params = httpParams;
    return this.http.get<any>(this.imageAnnotationsCollectionsUrl + '/search/findByNameContainingIgnoreCase', httpOptions).pipe(
      map((result: any) => {
        result.data = result._embedded.imageAnnotationsCollections;
        return result;
      }));
  }

  getAnnotations(id: string, params): Observable<PaginatedImageAnnotations> {
    const httpOptions = {
      headers: new HttpHeaders({'Content-Type': 'application/json'}),
      params: {}
    };
    if (params) {
      const page = params.pageIndex ? params.pageIndex : null;
      const size = params.size ? params.size : null;
      const httpParams = new HttpParams().set('page', page).set('size', size);
      httpOptions.params = httpParams;
    }
    return this.http.get<any>(`${this.imageAnnotationsCollectionsUrl}/${id}/annotations`, httpOptions).pipe(
      map((result: any) => {
        result.data = result._embedded.imageAnnotations;
        return result;
      }));
  }

  getAllAnnotationsList(imageAnnotationsCollection: ImageAnnotationsCollection): Observable<ImageAnnotation[]> {
    const httpOptions = {
      headers: new HttpHeaders({'Content-Type': 'application/json'}),
      params: {}
    };
    return this.http.get<any>(`${this.imageAnnotationsCollectionsUrl}/${imageAnnotationsCollection.id}/annotations/getAllAnnotationsList`,
      httpOptions);
  }

  getJob(jobUrl: string): Observable<Job> {
    return this.http.get<Job>(jobUrl);
  }

  createAnnotationsCollection(annotationsCollection: ImageAnnotationsCollection): Observable<ImageAnnotationsCollection> {
    return this.http.post<ImageAnnotationsCollection>(this.imageAnnotationsCollectionsUrl, annotationsCollection);
  }

  addAnnotations(annotationsCollection: ImageAnnotationsCollection, annotations: ImageAnnotation[]): Observable<PaginatedImageAnnotations> {
    return this.http.post<any>(`${this.imageAnnotationsCollectionsUrl}/${annotationsCollection.id}/annotations`, annotations);
  }

  setupAnnotationTask(name: string, labels: Label[], segmentSize: number): Observable<any> {
    return this.http.post<any>(`${this.imageAnnotationsApiUrl}/create/task`, {
      org: "WIPP",
      name: name,
      labels: labels,
      segmentSize: segmentSize,
      guide: "# WIPP annotations guide\n- Create/correct annotations (make sure to check all frames)\n- Click on \"Menu\" -> \"Finish the job\" to save annotation and mark the job as completed\n- Click on \"Menu\" -> \"Open the task\" to go back to the task view\n- Change the job *Stage* to \"acceptance\" and *State* to \"completed\"\n- Marking all jobs as completed et accepted will automatically trigger the import of the annotations into WIPP"

    });
  }

  uploadToAnnotationTask(annotationList: ImageAnnotation[], taskId: string, userAssignees: string[], maskType: number, tiling: any): Observable<any> {
    return this.http.post<any>(`${this.imageAnnotationsApiUrl}/upload`, {
      task_id: taskId,
      assignees: userAssignees,
      org: "WIPP",
      organization_id: "WIPP",
      files: annotationList,
      mask_type: 1,
      tiling: tiling
    });
  }

  downloadAnnotationFile(annotationsCollection: ImageAnnotationsCollection, fileName: string): Observable<any> {
    return this.http.get<any>(`${this.imageAnnotationsCollectionsUrl}/${annotationsCollection.id}/annotations/${fileName}`);
  }

  deleteAnnotationsCollection(annotationsCollection: ImageAnnotationsCollection) {
    return this.http.delete<ImageAnnotationsCollection>(annotationsCollection._links.self.href);
  }

  startDownload(url: string): Observable<string> {
    return this.http.get<string>(url);
  }

  makePublicCollection(annotationsCollection: ImageAnnotationsCollection): Observable<ImageAnnotationsCollection> {
    const httpOptions = {
      headers: new HttpHeaders({'Content-Type': 'application/json'}),
      params: {}
    };
    return this.http.patch<ImageAnnotationsCollection>(`${this.imageAnnotationsCollectionsUrl}/${annotationsCollection.id}`, {publiclyShared: true}, httpOptions);
  }

  updateCollectionTaskId(annotationsCollection: ImageAnnotationsCollection, taskId: string): Observable<ImageAnnotationsCollection> {
    const httpOptions = {
      headers: new HttpHeaders({'Content-Type': 'application/json'}),
      params: {}
    };
    return this.http.patch<ImageAnnotationsCollection>(`${this.imageAnnotationsCollectionsUrl}/${annotationsCollection.id}`, {taskId: taskId}, httpOptions);
  }
}
