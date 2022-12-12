import { TestBed } from '@angular/core/testing';

import { TwoStepAuthGuard } from './two-step-auth.guard';

describe('TwoStepAuthGuard', () => {
  let guard: TwoStepAuthGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(TwoStepAuthGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
