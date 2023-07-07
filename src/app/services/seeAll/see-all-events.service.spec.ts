import { TestBed } from '@angular/core/testing';

import { SeeAllEventsService } from './see-all-events.service';

describe('SeeAllEventsService', () => {
  let service: SeeAllEventsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SeeAllEventsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
