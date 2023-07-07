import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewerResultsComponent } from './viewer-results.component';

describe('ViewerResultsComponent', () => {
  let component: ViewerResultsComponent;
  let fixture: ComponentFixture<ViewerResultsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewerResultsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewerResultsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
