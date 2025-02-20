import { TestBed } from '@angular/core/testing';

import { IterativeTrainingPipelineService } from './iterative-training-pipeline.service';

describe('IterativeTrainingPipelineService', () => {
  let service: IterativeTrainingPipelineService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(IterativeTrainingPipelineService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
