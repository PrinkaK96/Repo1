import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewerRoundRobinComponent } from './viewer-round-robin.component';

describe('ViewerRoundRobinComponent', () => {
  let component: ViewerRoundRobinComponent;
  let fixture: ComponentFixture<ViewerRoundRobinComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewerRoundRobinComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewerRoundRobinComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
