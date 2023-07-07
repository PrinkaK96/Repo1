import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommonScoreComponent } from './common-score.component';

describe('CommonScoreComponent', () => {
  let component: CommonScoreComponent;
  let fixture: ComponentFixture<CommonScoreComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ CommonScoreComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CommonScoreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
