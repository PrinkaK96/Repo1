import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminPlayerDashboardComponent } from './admin-player-dashboard.component';

describe('AdminPlayerDashboardComponent', () => {
  let component: AdminPlayerDashboardComponent;
  let fixture: ComponentFixture<AdminPlayerDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdminPlayerDashboardComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminPlayerDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
