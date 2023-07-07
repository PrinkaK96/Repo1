import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StreamMatchesComponent } from './stream-matches.component';

describe('StreamMatchesComponent', () => {
  let component: StreamMatchesComponent;
  let fixture: ComponentFixture<StreamMatchesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StreamMatchesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StreamMatchesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
