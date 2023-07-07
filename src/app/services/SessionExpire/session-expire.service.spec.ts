import { TestBed } from '@angular/core/testing';

import { SessionExpireService } from './session-expire.service';

describe('SessionExpireService', () => {
  let service: SessionExpireService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SessionExpireService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
