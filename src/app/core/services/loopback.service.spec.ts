import { TestBed } from '@angular/core/testing';

import { LoopbackService } from './loopback.service';

describe('LoopbackService', () => {
  let service: LoopbackService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LoopbackService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
