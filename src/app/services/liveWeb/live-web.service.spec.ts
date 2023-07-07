import { TestBed } from '@angular/core/testing';

import { LiveWebService } from './live-web.service';

describe('LiveWebService', () => {
  let service: LiveWebService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LiveWebService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
