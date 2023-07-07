import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResultGPlayOffComponent } from './result-g-play-off.component';

describe('ResultGPlayOffComponent', () => {
  let component: ResultGPlayOffComponent;
  let fixture: ComponentFixture<ResultGPlayOffComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ResultGPlayOffComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ResultGPlayOffComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
