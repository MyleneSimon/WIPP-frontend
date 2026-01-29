import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';

import { GenericDataTemplateComponent } from './generic-data-template.component';

describe('GenericDataTemplateComponent', () => {
  let component: GenericDataTemplateComponent;
  let fixture: ComponentFixture<GenericDataTemplateComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ GenericDataTemplateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GenericDataTemplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
