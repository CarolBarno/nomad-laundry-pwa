import { TestBed } from '@angular/core/testing';

import { AsyncValidatorService } from './async-validator.service';

describe('AsyncValidatorService', () => {
  let service: AsyncValidatorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AsyncValidatorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
