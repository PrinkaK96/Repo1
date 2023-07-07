import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateScoreComponent } from './update-score.component';

describe('UpdateScoreComponent', () => {
  let component: UpdateScoreComponent;
  let fixture: ComponentFixture<UpdateScoreComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ UpdateScoreComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UpdateScoreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
