import { TestBed } from '@angular/core/testing';

import { ProfileLettersService } from './profile-letters.service';

describe('ProfileLettersService', () => {
  let service: ProfileLettersService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProfileLettersService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
