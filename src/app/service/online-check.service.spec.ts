import { TestBed } from '@angular/core/testing';

import { OnlineCheckService } from './online-check.service';

describe('OnlineCheckService', () => {
  let service: OnlineCheckService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OnlineCheckService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
