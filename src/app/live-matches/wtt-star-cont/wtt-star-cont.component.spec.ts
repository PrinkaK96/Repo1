import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WttStarContComponent } from './wtt-star-cont.component';

describe('WttStarContComponent', () => {
  let component: WttStarContComponent;
  let fixture: ComponentFixture<WttStarContComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WttStarContComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WttStarContComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
