import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MamberComponent } from './mamber.component';

describe('MamberComponent', () => {
  let component: MamberComponent;
  let fixture: ComponentFixture<MamberComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MamberComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MamberComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
