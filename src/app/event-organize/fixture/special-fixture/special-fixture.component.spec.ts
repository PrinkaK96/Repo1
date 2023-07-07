import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SpecialFixtureComponent } from './special-fixture.component';

describe('SpecialFixtureComponent', () => {
  let component: SpecialFixtureComponent;
  let fixture: ComponentFixture<SpecialFixtureComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SpecialFixtureComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SpecialFixtureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
