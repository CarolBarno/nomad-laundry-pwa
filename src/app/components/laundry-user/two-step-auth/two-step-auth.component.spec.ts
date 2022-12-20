import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TwoStepAuthComponent } from './two-step-auth.component';

describe('TwoStepAuthComponent', () => {
  let component: TwoStepAuthComponent;
  let fixture: ComponentFixture<TwoStepAuthComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TwoStepAuthComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TwoStepAuthComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
