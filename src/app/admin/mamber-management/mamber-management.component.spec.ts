import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MamberManagementComponent } from './mamber-management.component';

describe('MamberManagementComponent', () => {
  let component: MamberManagementComponent;
  let fixture: ComponentFixture<MamberManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MamberManagementComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MamberManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
