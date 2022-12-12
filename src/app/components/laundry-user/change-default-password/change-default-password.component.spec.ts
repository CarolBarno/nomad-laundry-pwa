import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangeDefaultPasswordComponent } from './change-default-password.component';

describe('ChangeDefaultPasswordComponent', () => {
  let component: ChangeDefaultPasswordComponent;
  let fixture: ComponentFixture<ChangeDefaultPasswordComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChangeDefaultPasswordComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChangeDefaultPasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
