import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KnockoutComponent } from './knockout.component';

describe('KnockoutComponent', () => {
  let component: KnockoutComponent;
  let fixture: ComponentFixture<KnockoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ KnockoutComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(KnockoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
