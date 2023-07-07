import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DshboardTeamsComponent } from './dshboard-teams.component';

describe('DshboardTeamsComponent', () => {
  let component: DshboardTeamsComponent;
  let fixture: ComponentFixture<DshboardTeamsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DshboardTeamsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DshboardTeamsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
