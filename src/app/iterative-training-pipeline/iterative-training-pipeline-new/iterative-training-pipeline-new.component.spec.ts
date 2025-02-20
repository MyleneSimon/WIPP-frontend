import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IterativeTrainingPipelineNewComponent } from './iterative-training-pipeline-new.component';

describe('IterativeTrainingPipelineNewComponent', () => {
  let component: IterativeTrainingPipelineNewComponent;
  let fixture: ComponentFixture<IterativeTrainingPipelineNewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IterativeTrainingPipelineNewComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(IterativeTrainingPipelineNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
