import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams, HttpRequest, HttpResponse} from '@angular/common/http';
import {Observable, of as observableOf} from 'rxjs';
import {ImagesCollection, PaginatedImagesCollections} from './images-collection';
import {map} from 'rxjs/operators';
import {Image, PaginatedImages} from './image';
import {MetadataFile, PaginatedMetadataFiles} from './metadata-file';
import {environment} from '../../environments/environment';
import {Job} from '../job/job';
import {DataService} from '../data-service';

@Injectable({
  providedIn: 'root'
})
export class ImagesCollectionService implements DataService<ImagesCollection, PaginatedImagesCollections> {

  private imagesCollectionsUrl = environment.apiRootUrl + '/imagesCollections';
  constructor(
    private http: HttpClient
  ) {
  }

  getById(id: string): Observable<ImagesCollection> {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
      params: {}
    };
    return this.http.get<ImagesCollection>(`${this.imagesCollectionsUrl}/${id}`, httpOptions);
  }

  get(params): Observable<PaginatedImagesCollections> {
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
    return this.http.get<any>(this.imagesCollectionsUrl, httpOptions).pipe(
      map((result: any) => {
        result.data = result._embedded.imagesCollections;
        return result;
      }));
  }

  getByNameContainingIgnoreCase(params, name): Observable<PaginatedImagesCollections> {
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
    return this.http.get<any>(this.imagesCollectionsUrl + '/search/findByNameContainingIgnoreCase', httpOptions).pipe(
      map((result: any) => {
        result.data = result._embedded.imagesCollections;
        return result;
      }));
  }

  getImagesCollectionsByNameContainingIgnoreCaseAndNumberOfImages(params, name, nbOfImgs): Observable<PaginatedImagesCollections> {
    const httpOptions = {
      headers: new HttpHeaders({'Content-Type': 'application/json'}),
      params: {}
    };
    let httpParams = new HttpParams().set('name', name).set('numberOfImages', nbOfImgs);
    if (params) {
      const page = params.pageIndex ? params.pageIndex : null;
      const size = params.size ? params.size : null;
      const sort = params.sort ? params.sort : null;
      httpParams = httpParams.set('page', page).set('size', size).set('sort', sort);
    }
    httpOptions.params = httpParams;
    return this.http.get<any>(this.imagesCollectionsUrl + '/search/findByNameContainingIgnoreCaseAndNumberOfImages', httpOptions).pipe(
      map((result: any) => {
        result.data = result._embedded.imagesCollections;
        return result;
      }));
  }

  setImagesCollectionName(imagesCollection: ImagesCollection, name: string): Observable<ImagesCollection> {
    const httpOptions = {
      headers: new HttpHeaders({'Content-Type': 'application/json'}),
      params: {}
    };
    return this.http.patch<ImagesCollection>(`${this.imagesCollectionsUrl}/${imagesCollection.id}`, {name: name}, httpOptions);
  }

  setImagesCollectionNotes(imagesCollection: ImagesCollection, notes: string): Observable<ImagesCollection> {
    const httpOptions = {
      headers: new HttpHeaders({'Content-Type': 'application/json'}),
      params: {}
    };
    return this.http.patch<ImagesCollection>(`${this.imagesCollectionsUrl}/${imagesCollection.id}`, {notes: notes}, httpOptions);
  }

  getImages(imagesCollection: ImagesCollection, params): Observable<PaginatedImages> {
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
    return this.http.get<any>(`${this.imagesCollectionsUrl}/${imagesCollection.id}/images`, httpOptions).pipe(
      map((result: any) => {
        result.data = result._embedded.images;
        return result;
      }));
  }

  getMetadataFiles(imagesCollection: ImagesCollection, params): Observable<PaginatedMetadataFiles> {
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
    return this.http.get<any>(`${this.imagesCollectionsUrl}/${imagesCollection.id}/metadataFiles`, httpOptions).pipe(
      map((result: any) => {
        result.data = result._embedded.metadataFiles;
        return result;
      }));
  }

  createImagesCollection(imagesCollection: ImagesCollection): Observable<ImagesCollection> {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
      params: {}
    };
    return this.http.post<ImagesCollection>(this.imagesCollectionsUrl, imagesCollection, httpOptions);
  }

  deleteImagesCollection(imagesCollection: ImagesCollection) {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
      params: {}
    };
    return this.http.delete<ImagesCollection>(imagesCollection._links.self.href, httpOptions);
  }

  deleteImage(image: Image) {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
      params: {}
    };
    return this.http.delete<Image>(image._links.self.href, httpOptions);
  }

  deleteAllImages(imagesCollection: ImagesCollection) {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
      params: {}
    };
    if (imagesCollection.numberOfImages > 0) {
      return this.http.delete(`${this.imagesCollectionsUrl}/${imagesCollection.id}/images`, httpOptions);
    }
  }

  deleteMetadataFile(metadata: MetadataFile) {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
      params: {}
    };
    return this.http.delete<Image>(metadata._links.self.href, httpOptions);
  }

  deleteAllMetadataFiles(imagesCollection: ImagesCollection) {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
      params: {}
    };
    if (imagesCollection.numberOfMetadataFiles > 0) {
      return this.http.delete(`${this.imagesCollectionsUrl}/${imagesCollection.id}/metadataFiles`, httpOptions);
    }
  }

  makePublicImagesCollection(imagesCollection: ImagesCollection): Observable<ImagesCollection> {
    const httpOptions = {
      headers: new HttpHeaders({'Content-Type': 'application/json'}),
      params: {}
    };
    return this.http.patch<ImagesCollection>(`${this.imagesCollectionsUrl}/${imagesCollection.id}`, {publiclyShared: true}, httpOptions);
  }

  lockImagesCollection(imagesCollection: ImagesCollection): Observable<ImagesCollection> {
    const httpOptions = {
      headers: new HttpHeaders({'Content-Type': 'application/json'}),
      params: {}
    };
    return this.http.patch<ImagesCollection>(`${this.imagesCollectionsUrl}/${imagesCollection.id}`, {locked: true}, httpOptions);
  }

  getImagesUrl(imagesCollection: ImagesCollection): string {
    return `${this.imagesCollectionsUrl}/${imagesCollection.id}/images`;
  }

  getMetadataFilesUrl(imagesCollection: ImagesCollection): string {
    return `${this.imagesCollectionsUrl}/${imagesCollection.id}/metadataFiles`;
  }

  getSourceJob(imagesCollection: ImagesCollection): Observable<Job> {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
      params: {}
    };
    if (imagesCollection._links['sourceJob']) {
      return this.http.get<Job>(imagesCollection._links['sourceJob']['href'], httpOptions);
    }
    return observableOf(null);
  }

  startDownload(url: string): Observable<string> {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
      params: {}
    };
    return this.http.get<string>(url, httpOptions);
  }

}
