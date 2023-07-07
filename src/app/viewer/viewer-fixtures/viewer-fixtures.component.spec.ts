import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewerFixturesComponent } from './viewer-fixtures.component';

describe('ViewerFixturesComponent', () => {
  let component: ViewerFixturesComponent;
  let fixture: ComponentFixture<ViewerFixturesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewerFixturesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewerFixturesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
