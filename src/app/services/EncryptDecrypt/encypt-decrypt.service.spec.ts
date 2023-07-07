import { TestBed } from '@angular/core/testing';

import { EncyptDecryptService } from './encypt-decrypt.service';

describe('EncyptDecryptService', () => {
  let service: EncyptDecryptService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EncyptDecryptService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
