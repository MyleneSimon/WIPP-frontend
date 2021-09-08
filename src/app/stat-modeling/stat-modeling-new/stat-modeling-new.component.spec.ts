import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StatModelingNewComponent } from './stat-modeling-new.component';

describe('StatModelingNewComponent', () => {
  let component: StatModelingNewComponent;
  let fixture: ComponentFixture<StatModelingNewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StatModelingNewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StatModelingNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
