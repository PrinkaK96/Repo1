import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateOfficialComponent } from './create-official.component';

describe('CreateOfficialComponent', () => {
  let component: CreateOfficialComponent;
  let fixture: ComponentFixture<CreateOfficialComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateOfficialComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateOfficialComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
