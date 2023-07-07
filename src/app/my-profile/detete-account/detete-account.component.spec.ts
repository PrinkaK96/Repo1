import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeteteAccountComponent } from './detete-account.component';

describe('DeteteAccountComponent', () => {
  let component: DeteteAccountComponent;
  let fixture: ComponentFixture<DeteteAccountComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DeteteAccountComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DeteteAccountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
