import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewerKnockoutComponent } from './viewer-knockout.component';

describe('ViewerKnockoutComponent', () => {
  let component: ViewerKnockoutComponent;
  let fixture: ComponentFixture<ViewerKnockoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewerKnockoutComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewerKnockoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
