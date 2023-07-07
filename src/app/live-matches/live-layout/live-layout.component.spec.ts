import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LiveLayoutComponent } from './live-layout.component';

describe('LiveLayoutComponent', () => {
  let component: LiveLayoutComponent;
  let fixture: ComponentFixture<LiveLayoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LiveLayoutComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LiveLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
