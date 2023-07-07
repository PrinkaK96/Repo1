import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BroadcastVideosComponent } from './broadcast-videos.component';

describe('BroadcastVideosComponent', () => {
  let component: BroadcastVideosComponent;
  let fixture: ComponentFixture<BroadcastVideosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BroadcastVideosComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BroadcastVideosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
