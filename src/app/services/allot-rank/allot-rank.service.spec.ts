import { TestBed } from '@angular/core/testing';

import { AllotRankService } from './allot-rank.service';

describe('AllotRankService', () => {
  let service: AllotRankService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AllotRankService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
