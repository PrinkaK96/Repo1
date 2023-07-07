import { TestBed } from '@angular/core/testing';

import { RouteChangeDetectorService } from './route-change-detector.service';

describe('RouteChangeDetectorService', () => {
  let service: RouteChangeDetectorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RouteChangeDetectorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
