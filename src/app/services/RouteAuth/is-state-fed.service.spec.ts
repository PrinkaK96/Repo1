import { TestBed } from '@angular/core/testing';

import { IsStateFedService } from './is-state-fed.service';

describe('IsStateFedService', () => {
  let service: IsStateFedService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(IsStateFedService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
