import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DragDropFixtureComponent } from './drag-drop-fixture.component';

describe('DragDropFixtureComponent', () => {
  let component: DragDropFixtureComponent;
  let fixture: ComponentFixture<DragDropFixtureComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DragDropFixtureComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DragDropFixtureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
