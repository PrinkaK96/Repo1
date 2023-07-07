import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArrangeDialogComponent } from './arrange-dialog.component';

describe('ArrangeDialogComponent', () => {
  let component: ArrangeDialogComponent;
  let fixture: ComponentFixture<ArrangeDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ArrangeDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ArrangeDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
