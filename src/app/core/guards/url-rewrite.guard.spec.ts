import { TestBed } from '@angular/core/testing';

import { UrlRewriteGuard } from './url-rewrite.guard';

describe('UrlRewriteGuard', () => {
  let guard: UrlRewriteGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(UrlRewriteGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
