import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImportPlayerComponent } from './import-player.component';

describe('ImportPlayerComponent', () => {
  let component: ImportPlayerComponent;
  let fixture: ComponentFixture<ImportPlayerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ImportPlayerComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ImportPlayerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
