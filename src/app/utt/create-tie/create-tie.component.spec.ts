import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateTieComponent } from './create-tie.component';

describe('CreateTieComponent', () => {
  let component: CreateTieComponent;
  let fixture: ComponentFixture<CreateTieComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateTieComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateTieComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
