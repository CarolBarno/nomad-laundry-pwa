import { TestBed } from '@angular/core/testing';

import { PreventChangesGuard } from './prevent-changes.guard';

describe('PreventChangesGuard', () => {
  let guard: PreventChangesGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(PreventChangesGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
