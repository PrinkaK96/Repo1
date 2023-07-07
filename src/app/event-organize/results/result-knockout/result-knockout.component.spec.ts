import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResultKnockoutComponent } from './result-knockout.component';

describe('ResultKnockoutComponent', () => {
  let component: ResultKnockoutComponent;
  let fixture: ComponentFixture<ResultKnockoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ResultKnockoutComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ResultKnockoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
