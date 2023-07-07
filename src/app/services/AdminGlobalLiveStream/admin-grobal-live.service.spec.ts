import { TestBed } from '@angular/core/testing';

import { AdminGrobalLiveService } from './admin-grobal-live.service';

describe('AdminGrobalLiveService', () => {
  let service: AdminGrobalLiveService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AdminGrobalLiveService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
