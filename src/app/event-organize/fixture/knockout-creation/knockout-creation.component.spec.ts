import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KnockoutCreationComponent } from './knockout-creation.component';

describe('KnockoutCreationComponent', () => {
  let component: KnockoutCreationComponent;
  let fixture: ComponentFixture<KnockoutCreationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ KnockoutCreationComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(KnockoutCreationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
