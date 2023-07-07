import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RuleSettingComponent } from './rule-setting.component';

describe('RuleSettingComponent', () => {
  let component: RuleSettingComponent;
  let fixture: ComponentFixture<RuleSettingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RuleSettingComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RuleSettingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
