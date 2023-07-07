import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllRecentsComponent } from './all-recents.component';

describe('AllRecentsComponent', () => {
  let component: AllRecentsComponent;
  let fixture: ComponentFixture<AllRecentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AllRecentsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AllRecentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
