import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewerGroupCreationComponent } from './viewer-group-creation.component';

describe('ViewerGroupCreationComponent', () => {
  let component: ViewerGroupCreationComponent;
  let fixture: ComponentFixture<ViewerGroupCreationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewerGroupCreationComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewerGroupCreationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
