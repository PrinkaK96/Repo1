import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResultGroupsComponent } from './result-groups.component';

describe('ResultGroupsComponent', () => {
  let component: ResultGroupsComponent;
  let fixture: ComponentFixture<ResultGroupsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ResultGroupsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ResultGroupsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
