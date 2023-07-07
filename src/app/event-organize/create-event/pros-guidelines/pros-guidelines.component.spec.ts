import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProsGuidelinesComponent } from './pros-guidelines.component';

describe('ProsGuidelinesComponent', () => {
  let component: ProsGuidelinesComponent;
  let fixture: ComponentFixture<ProsGuidelinesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProsGuidelinesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProsGuidelinesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
