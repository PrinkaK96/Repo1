import { TestBed } from '@angular/core/testing';

import { CheckRoutePermissionService } from './check-route-permission.service';

describe('CheckRoutePermissionService', () => {
  let service: CheckRoutePermissionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CheckRoutePermissionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
