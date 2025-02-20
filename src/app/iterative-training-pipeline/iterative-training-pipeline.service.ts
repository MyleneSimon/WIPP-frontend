import { Injectable } from '@angular/core';
import {DataService} from '../data-service';
import {ImageAnnotationsCollection, PaginatedImageAnnotationsCollections} from '../image-annotations/image-annotations-collection';
import {environment} from '../../environments/environment';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {IterativeTrainingPipeline, PaginatedIterativeTrainingPipelines} from './iterative-training-pipeline';

@Injectable({
  providedIn: 'root'
})
export class IterativeTrainingPipelineService implements DataService<IterativeTrainingPipeline, PaginatedIterativeTrainingPipelines> {

  private iterativeTrainingPipelinesUrl = environment.apiRootUrl + '/iterativeTrainingPipelines';

  constructor(
    private http: HttpClient
  ) { }

  get(params): Observable<PaginatedIterativeTrainingPipelines> {
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
    return this.http.get<any>(this.iterativeTrainingPipelinesUrl, httpOptions).pipe(
      map((result: any) => {
        result.data = result._embedded.iterativeTrainingPipelines;
        return result;
      }));
  }

  getById(id): Observable<IterativeTrainingPipeline> {
    return this.http.get<IterativeTrainingPipeline>(`${this.iterativeTrainingPipelinesUrl}/${id}`);
  }

  getByNameContainingIgnoreCase(params, name): Observable<PaginatedIterativeTrainingPipelines> {
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
    return this.http.get<any>(this.iterativeTrainingPipelinesUrl + '/search/findByNameContainingIgnoreCase', httpOptions).pipe(
      map((result: any) => {
        result.data = result._embedded.iterativeTrainingPipelines;
        return result;
      }));
  }



  createIterativeTrainingPipeline(iterativeTrainingPipeline: IterativeTrainingPipeline): Observable<IterativeTrainingPipeline> {
    return this.http.post<IterativeTrainingPipeline>(this.iterativeTrainingPipelinesUrl, iterativeTrainingPipeline);
  }


  deleteIterativeTrainingPipeline(iterativeTrainingPipeline: IterativeTrainingPipeline) {
    return this.http.delete<IterativeTrainingPipeline>(iterativeTrainingPipeline._links.self.href);
  }

  addIteration(iterativeTrainingPipeline: IterativeTrainingPipeline): Observable<IterativeTrainingPipeline> {
    return this.http.post<IterativeTrainingPipeline>(`${iterativeTrainingPipeline._links.self.href}/iterations/add`, null);
  }

  makePublicPipeline(iterativeTrainingPipeline: IterativeTrainingPipeline): Observable<IterativeTrainingPipeline> {
    const httpOptions = {
      headers: new HttpHeaders({'Content-Type': 'application/json'}),
      params: {}
    };
    return this.http.patch<IterativeTrainingPipeline>(`${this.iterativeTrainingPipelinesUrl}/${iterativeTrainingPipeline.id}`, {publiclyShared: true}, httpOptions);
  }
}
