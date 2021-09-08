import { TestBed } from '@angular/core/testing';

import { StatModelingService } from './stat-modeling.service';

describe('StatModelingService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: StatModelingService = TestBed.get(StatModelingService);
    expect(service).toBeTruthy();
  });
});
