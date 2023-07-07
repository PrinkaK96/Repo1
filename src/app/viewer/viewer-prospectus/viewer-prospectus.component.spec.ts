import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewerProspectusComponent } from './viewer-prospectus.component';

describe('ViewerProspectusComponent', () => {
  let component: ViewerProspectusComponent;
  let fixture: ComponentFixture<ViewerProspectusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewerProspectusComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewerProspectusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
