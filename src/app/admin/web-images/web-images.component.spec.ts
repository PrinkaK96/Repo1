import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WebImagesComponent } from './web-images.component';

describe('WebImagesComponent', () => {
  let component: WebImagesComponent;
  let fixture: ComponentFixture<WebImagesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WebImagesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WebImagesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
