import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddOfficialComponent } from './add-official.component';

describe('AddOfficialComponent', () => {
  let component: AddOfficialComponent;
  let fixture: ComponentFixture<AddOfficialComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddOfficialComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddOfficialComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
