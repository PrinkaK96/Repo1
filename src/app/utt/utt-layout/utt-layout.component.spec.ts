import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UttLayoutComponent } from './utt-layout.component';

describe('UttLayoutComponent', () => {
  let component: UttLayoutComponent;
  let fixture: ComponentFixture<UttLayoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UttLayoutComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UttLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
