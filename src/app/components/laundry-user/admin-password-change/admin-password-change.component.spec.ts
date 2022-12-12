import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminPasswordChangeComponent } from './admin-password-change.component';

describe('AdminPasswordChangeComponent', () => {
  let component: AdminPasswordChangeComponent;
  let fixture: ComponentFixture<AdminPasswordChangeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdminPasswordChangeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminPasswordChangeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
