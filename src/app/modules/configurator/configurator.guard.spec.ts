import { TestBed } from '@angular/core/testing';

import { ConfiguratorGuard } from './configurator.guard';

describe('ConfiguratorGuard', () => {
  let guard: ConfiguratorGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(ConfiguratorGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
