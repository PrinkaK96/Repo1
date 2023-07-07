import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OfficialListComponent } from './official-list.component';

describe('OfficialListComponent', () => {
  let component: OfficialListComponent;
  let fixture: ComponentFixture<OfficialListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OfficialListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OfficialListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
