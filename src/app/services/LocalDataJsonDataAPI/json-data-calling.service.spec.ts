import { TestBed } from '@angular/core/testing';

import { JsonDataCallingService } from './json-data-calling.service';

describe('JsonDataCallingService', () => {
  let service: JsonDataCallingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(JsonDataCallingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
