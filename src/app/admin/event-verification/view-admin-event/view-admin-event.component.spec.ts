import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewAdminEventComponent } from './view-admin-event.component';

describe('ViewAdminEventComponent', () => {
  let component: ViewAdminEventComponent;
  let fixture: ComponentFixture<ViewAdminEventComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewAdminEventComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewAdminEventComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
