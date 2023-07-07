import { ComponentFixture, TestBed } from '@angular/core/testing';

import {  BroadcastViewerResultsComponent } from './broadcast-viewer-results.component';

describe('ViewerResultsComponent', () => {
  let component: BroadcastViewerResultsComponent;
  let fixture: ComponentFixture<BroadcastViewerResultsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BroadcastViewerResultsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BroadcastViewerResultsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
