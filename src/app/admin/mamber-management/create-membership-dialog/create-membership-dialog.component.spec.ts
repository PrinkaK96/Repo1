import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateMembershipDialogComponent } from './create-membership-dialog.component';

describe('CreateMembershipDialogComponent', () => {
  let component: CreateMembershipDialogComponent;
  let fixture: ComponentFixture<CreateMembershipDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateMembershipDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateMembershipDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
