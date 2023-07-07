import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CreateMixDouble } from './create-mix-double.component';



describe('CreateMixDouble', () => {
  let component: CreateMixDouble;
  let fixture: ComponentFixture<CreateMixDouble>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateMixDouble ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateMixDouble);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
