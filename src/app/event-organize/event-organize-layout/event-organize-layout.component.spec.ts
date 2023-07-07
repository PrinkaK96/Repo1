import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EventOrganizeLayoutComponent } from './event-organize-layout.component';

describe('EventOrganizeLayoutComponent', () => {
  let component: EventOrganizeLayoutComponent;
  let fixture: ComponentFixture<EventOrganizeLayoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EventOrganizeLayoutComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EventOrganizeLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
