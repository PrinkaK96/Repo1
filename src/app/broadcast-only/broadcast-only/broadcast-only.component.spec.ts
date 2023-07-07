import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BroadcastOnlyComponent } from './broadcast-only.component';

describe('BroadcastOnlyComponent', () => {
  let component: BroadcastOnlyComponent;
  let fixture: ComponentFixture<BroadcastOnlyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BroadcastOnlyComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BroadcastOnlyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
