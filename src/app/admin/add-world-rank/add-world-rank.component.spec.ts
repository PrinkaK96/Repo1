import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddWorldRankComponent } from './add-world-rank.component';

describe('AddWorldRankComponent', () => {
  let component: AddWorldRankComponent;
  let fixture: ComponentFixture<AddWorldRankComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddWorldRankComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddWorldRankComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
