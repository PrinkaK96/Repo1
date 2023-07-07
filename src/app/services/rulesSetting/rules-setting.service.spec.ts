import { TestBed } from '@angular/core/testing';

import { RulesSettingService } from './rules-setting.service';

describe('RulesSettingService', () => {
  let service: RulesSettingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RulesSettingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
