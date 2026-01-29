import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';

import { CsvCollectionDetailComponent } from './csv-collection-detail.component';

describe('CsvCollectionDetailComponent', () => {
  let component: CsvCollectionDetailComponent;
  let fixture: ComponentFixture<CsvCollectionDetailComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ CsvCollectionDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CsvCollectionDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
