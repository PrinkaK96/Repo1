import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewerTreeComponent } from './viewer-tree.component';

describe('ViewerTreeComponent', () => {
  let component: ViewerTreeComponent;
  let fixture: ComponentFixture<ViewerTreeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewerTreeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewerTreeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
