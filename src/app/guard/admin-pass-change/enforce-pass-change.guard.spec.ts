import { TestBed, async, inject } from '@angular/core/testing';

import { EnforcePassChangeGuard } from './enforce-pass-change.guard';

describe('EnforcePassChangeGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [EnforcePassChangeGuard]
    });
  });

  it('should ...', inject([EnforcePassChangeGuard], (guard: EnforcePassChangeGuard) => {
    expect(guard).toBeTruthy();
  }));
});
