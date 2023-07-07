import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateMatchScoreComponent } from './update-match-score.component';

describe('UpdateMatchScoreComponent', () => {
  let component: UpdateMatchScoreComponent;
  let fixture: ComponentFixture<UpdateMatchScoreComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UpdateMatchScoreComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UpdateMatchScoreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
