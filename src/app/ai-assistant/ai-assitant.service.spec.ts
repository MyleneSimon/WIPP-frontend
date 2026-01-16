import { TestBed } from '@angular/core/testing';

import { AiAssitantService } from './ai-assitant.service';

describe('AiAssitantService', () => {
  let service: AiAssitantService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AiAssitantService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
