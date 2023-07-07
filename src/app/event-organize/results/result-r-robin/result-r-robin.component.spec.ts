import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResultRRobinComponent } from './result-r-robin.component';

describe('ResultRRobinComponent', () => {
  let component: ResultRRobinComponent;
  let fixture: ComponentFixture<ResultRRobinComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ResultRRobinComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ResultRRobinComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
