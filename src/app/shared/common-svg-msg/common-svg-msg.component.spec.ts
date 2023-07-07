import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommonSvgMsgComponent } from './common-svg-msg.component';

describe('CommonSvgMsgComponent', () => {
  let component: CommonSvgMsgComponent;
  let fixture: ComponentFixture<CommonSvgMsgComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ CommonSvgMsgComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CommonSvgMsgComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
