import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommonTwoStepAuthComponent } from './common-two-step-auth.component';

describe('CommonTwoStepAuthComponent', () => {
  let component: CommonTwoStepAuthComponent;
  let fixture: ComponentFixture<CommonTwoStepAuthComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CommonTwoStepAuthComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CommonTwoStepAuthComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
