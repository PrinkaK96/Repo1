import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllotRankPointersComponent } from './allot-rank-pointers.component';

describe('AllotRankPointersComponent', () => {
  let component: AllotRankPointersComponent;
  let fixture: ComponentFixture<AllotRankPointersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AllotRankPointersComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AllotRankPointersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
