import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyProfileSidebarComponent } from './my-profile-sidebar.component';

describe('MyProfileSidebarComponent', () => {
  let component: MyProfileSidebarComponent;
  let fixture: ComponentFixture<MyProfileSidebarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MyProfileSidebarComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MyProfileSidebarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
