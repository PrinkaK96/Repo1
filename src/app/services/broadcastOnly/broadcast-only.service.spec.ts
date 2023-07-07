import { TestBed } from '@angular/core/testing';

import { BroadcastOnlyService } from './broadcast-only.service';

describe('BroadcastOnlyService', () => {
  let service: BroadcastOnlyService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BroadcastOnlyService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
