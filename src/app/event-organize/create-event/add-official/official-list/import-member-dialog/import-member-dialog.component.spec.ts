import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImportMemberDialogComponent } from './import-member-dialog.component';

describe('ImportMemberDialogComponent', () => {
  let component: ImportMemberDialogComponent;
  let fixture: ComponentFixture<ImportMemberDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ImportMemberDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ImportMemberDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
