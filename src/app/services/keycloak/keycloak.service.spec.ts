import { TestBed } from '@angular/core/testing';

import { KeycloakService } from './keycloak.service';

describe('KeycloakService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: KeycloakService = TestBed.inject(KeycloakService);
    expect(service).toBeTruthy();
  });
});
