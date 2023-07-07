import { TestBed } from '@angular/core/testing';

import { BannerManagementService } from './banner-management.service';

describe('BannerManagementService', () => {
  let service: BannerManagementService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BannerManagementService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
