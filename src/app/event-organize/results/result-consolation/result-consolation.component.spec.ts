import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ResultConsolationComponent } from './result-consolation.component';



describe('ResultKnockoutComponent', () => {
  let component: ResultConsolationComponent;
  let fixture: ComponentFixture<ResultConsolationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ResultConsolationComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ResultConsolationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
