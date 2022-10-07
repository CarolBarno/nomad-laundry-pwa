import { TestBed, async, inject } from '@angular/core/testing';

import { RedirectAuthGuard } from './redirect-auth.guard';

describe('RedirectAuthGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [RedirectAuthGuard]
    });
  });

  it('should ...', inject([RedirectAuthGuard], (guard: RedirectAuthGuard) => {
    expect(guard).toBeTruthy();
  }));
});
