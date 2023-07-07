import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EventOrgSidebarComponent } from './event-org-sidebar.component';

describe('EventOrgSidebarComponent', () => {
  let component: EventOrgSidebarComponent;
  let fixture: ComponentFixture<EventOrgSidebarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EventOrgSidebarComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EventOrgSidebarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
