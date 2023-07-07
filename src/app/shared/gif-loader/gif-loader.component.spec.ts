import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GifLoaderComponent } from './gif-loader.component';

describe('GifLoaderComponent', () => {
  let component: GifLoaderComponent;
  let fixture: ComponentFixture<GifLoaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ GifLoaderComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GifLoaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
