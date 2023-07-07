import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EventOrganizComponent } from './event-organiz.component';

describe('EventOrganizComponent', () => {
  let component: EventOrganizComponent;
  let fixture: ComponentFixture<EventOrganizComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EventOrganizComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EventOrganizComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
