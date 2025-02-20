import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IterativeTrainingPipelineDetailComponent } from './iterative-training-pipeline-detail.component';

describe('IterativeTrainingPipelineDetailComponent', () => {
  let component: IterativeTrainingPipelineDetailComponent;
  let fixture: ComponentFixture<IterativeTrainingPipelineDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IterativeTrainingPipelineDetailComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(IterativeTrainingPipelineDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
