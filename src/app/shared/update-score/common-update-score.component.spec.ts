import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommonUpdateScoreComponent } from './common-update-score.component';

describe('UpdateScoreComponent', () => {
  let component: CommonUpdateScoreComponent;
  let fixture: ComponentFixture<CommonUpdateScoreComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ CommonUpdateScoreComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CommonUpdateScoreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
