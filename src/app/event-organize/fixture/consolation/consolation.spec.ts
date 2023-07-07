import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Consolation } from './consolation';



describe('MainDrawComponent', () => {
  let component: Consolation;
  let fixture: ComponentFixture<Consolation>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Consolation ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Consolation);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
