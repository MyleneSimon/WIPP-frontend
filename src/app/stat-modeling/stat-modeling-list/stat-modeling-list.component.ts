import {Component, OnInit, ViewChild} from '@angular/core';
import {BehaviorSubject, Observable, of as observableOf} from 'rxjs';
import {MatPaginator, MatSort} from '@angular/material';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {Router} from '@angular/router';
import {KeycloakService} from '../../services/keycloak/keycloak.service';
import {catchError, map, switchMap} from 'rxjs/operators';
import {StatModelingService} from '../stat-modeling.service';
import {StatModelingNewComponent} from '../stat-modeling-new/stat-modeling-new.component';
import {StatModeling} from '../stat-modeling';

@Component({
  selector: 'app-stat-modeling-list',
  templateUrl: './stat-modeling-list.component.html',
  styleUrls: ['./stat-modeling-list.component.css']
})
export class StatModelingListComponent implements OnInit {

  displayedColumns: string[] = ['name', 'creationDate', 'owner', 'publiclyShared'];
  statModelings: Observable<StatModeling[]>;

  resultsLength = 0;
  pageSize = 10;
  pageSizeOptions: number[] = [10, 25, 50, 100];
  paramsChange: BehaviorSubject<{index: number, size: number, sort: string, filter: string}>;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private modalService: NgbModal,
    private router: Router,
    private statModelingService: StatModelingService,
    private keycloakService: KeycloakService
  ) {
    this.paramsChange = new BehaviorSubject({
      index: 0,
      size: this.pageSize,
      sort: 'creationDate,desc',
      filter: ''
    });
  }

  sortChanged(sort) {
    // If the user changes the sort order, reset back to the first page.
    this.paramsChange.next({
      index: 0, size: this.paramsChange.value.size,
      sort: sort.active + ',' + sort.direction, filter: this.paramsChange.value.filter
    });
  }

  pageChanged(page) {
    this.paramsChange.next({
      index: page.pageIndex, size: page.pageSize,
      sort: this.paramsChange.value.sort, filter: this.paramsChange.value.filter
    });
  }

  applyFilterByName(filterValue: string) {
    // if the user filters by name, reset back to the first page
    this.paramsChange.next({
      index: 0, size: this.paramsChange.value.size, sort: this.paramsChange.value.sort, filter: filterValue
    });
  }

  ngOnInit() {
    const paramsObservable = this.paramsChange.asObservable();
    this.statModelings = paramsObservable.pipe(
      switchMap((page) => {
        const params = {
          pageIndex: page.index,
          size: page.size,
          sort: page.sort
        };
        if (page.filter) {
          return this.statModelingService.getStatModelingsByNameContainingIgnoreCase(params, page.filter).pipe(
            map((paginatedResult) => {
              this.resultsLength = paginatedResult.page.totalElements;
              return paginatedResult.data;
            }),
            catchError(() => {
              return observableOf([]);
            })
          );
        }
        return this.statModelingService.getStatModelings(params).pipe(
          map((paginatedResult) => {
            this.resultsLength = paginatedResult.page.totalElements;
            return paginatedResult.data;
          }),
          catchError(() => {
            return observableOf([]);
          })
        );
      })
    );
  }

  createNew() {
    const modalRef = this.modalService.open(StatModelingNewComponent);
    modalRef.componentInstance.modalReference = modalRef;
    modalRef.result.then((result) => {
      this.statModelingService.createStatModeling(result).subscribe(statModeling => {
        const statModelingId = statModeling ? statModeling.id : null;
        this.router.navigate(['stat-modelings', statModelingId]);
      });
    }, (reason) => {
      console.log('dismissed');
    });
  }

  canCreate() : boolean {
    return(this.keycloakService.isLoggedIn());
  }

}
