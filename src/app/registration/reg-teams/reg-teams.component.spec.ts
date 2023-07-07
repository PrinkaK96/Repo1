import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegTeamsComponent } from './reg-teams.component';

describe('RegTeamsComponent', () => {
  let component: RegTeamsComponent;
  let fixture: ComponentFixture<RegTeamsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RegTeamsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegTeamsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
