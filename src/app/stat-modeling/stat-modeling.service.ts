import { Injectable } from '@angular/core';
import {environment} from '../../environments/environment';
import {HttpClient, HttpHeaders, HttpParams} from '../../../node_modules/@angular/common/http';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {PaginatedStatModeling, StatModeling} from './stat-modeling';

@Injectable({
  providedIn: 'root'
})
export class StatModelingService {

  private statModelingsUrl = environment.apiRootUrl + '/statModelings';

  constructor(
    private http: HttpClient
  ) { }

  getStatModeling(id: string): Observable<StatModeling> {
    return this.http.get<StatModeling>(`${this.statModelingsUrl}/${id}`);
  }

  getStatModelings(params): Observable<PaginatedStatModeling> {
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
    return this.http.get<any>(this.statModelingsUrl, httpOptions).pipe(
      map((result: any) => {
        result.data = result._embedded.statModelings;
        return result;
      }));
  }

  getStatModelingsByNameContainingIgnoreCase(params, name): Observable<PaginatedStatModeling> {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
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
    return this.http.get<any>(this.statModelingsUrl + '/search/findByNameContainingIgnoreCase', httpOptions).pipe(
      map((result: any) => {
        result.data = result._embedded.statModelings;
        return result;
      }));
  }

  createStatModeling(statModeling: StatModeling): Observable<StatModeling> {
    return this.http.post<StatModeling>(this.statModelingsUrl, statModeling);
  }

  setStatModelingManifest(statModeling: StatModeling, manifest: any) {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
      params: {}
    };
    return this.http.patch<StatModeling>(`${this.statModelingsUrl}/${statModeling.id}`, {manifest: manifest}, httpOptions);
  }

  makePublicStatModeling(statModeling: StatModeling): Observable<StatModeling> {
    const httpOptions = {
      headers: new HttpHeaders({'Content-Type': 'application/json'}),
      params: {}
    };
    return this.http.patch<StatModeling>(`${this.statModelingsUrl}/${statModeling.id}`, {publiclyShared: true}, httpOptions);
  }

}
