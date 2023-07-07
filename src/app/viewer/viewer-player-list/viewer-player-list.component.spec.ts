import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewerPlayerListComponent } from './viewer-player-list.component';

describe('ViewerPlayerListComponent', () => {
  let component: ViewerPlayerListComponent;
  let fixture: ComponentFixture<ViewerPlayerListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewerPlayerListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewerPlayerListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
