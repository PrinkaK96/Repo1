import { TestBed } from '@angular/core/testing';

import { AdminFooterService } from './admin-footer.service';

describe('AdminFooterService', () => {
  let service: AdminFooterService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AdminFooterService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
