import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminClubDashboardComponent } from './admin-club-dashboard.component';

describe('AdminClubDashboardComponent', () => {
  let component: AdminClubDashboardComponent;
  let fixture: ComponentFixture<AdminClubDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdminClubDashboardComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminClubDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
