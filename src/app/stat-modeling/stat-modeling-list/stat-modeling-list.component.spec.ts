import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StatModelingListComponent } from './stat-modeling-list.component';

describe('StatModelingListComponent', () => {
  let component: StatModelingListComponent;
  let fixture: ComponentFixture<StatModelingListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StatModelingListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StatModelingListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
