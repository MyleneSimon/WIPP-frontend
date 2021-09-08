import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StatModelingDetailComponent } from './stat-modeling-detail.component';

describe('StatModelingDetailComponent', () => {
  let component: StatModelingDetailComponent;
  let fixture: ComponentFixture<StatModelingDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StatModelingDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StatModelingDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
