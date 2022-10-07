import { TestBed, async, inject } from '@angular/core/testing';

import { EnforceDefaultPasswordChangeGuard } from './enforce-default-password-change.guard';

describe('EnforceDefaultPasswordChangeGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [EnforceDefaultPasswordChangeGuard]
    });
  });

  it('should ...', inject([EnforceDefaultPasswordChangeGuard], (guard: EnforceDefaultPasswordChangeGuard) => {
    expect(guard).toBeTruthy();
  }));
});
