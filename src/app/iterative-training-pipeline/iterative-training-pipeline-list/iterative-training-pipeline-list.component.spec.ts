import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IterativeTrainingPipelineListComponent } from './iterative-training-pipeline-list.component';

describe('IterativeTrainingPipelineListComponent', () => {
  let component: IterativeTrainingPipelineListComponent;
  let fixture: ComponentFixture<IterativeTrainingPipelineListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IterativeTrainingPipelineListComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(IterativeTrainingPipelineListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
