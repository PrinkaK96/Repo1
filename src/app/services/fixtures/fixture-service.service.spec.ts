import { TestBed } from '@angular/core/testing';

import { FixtureServiceService } from './fixture-service.service';

describe('FixtureServiceService', () => {
  let service: FixtureServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FixtureServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
