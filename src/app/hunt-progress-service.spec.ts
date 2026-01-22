import { TestBed } from '@angular/core/testing';

import { HuntProgressService } from './hunt-progress-service';

describe('HuntProgressService', () => {
  let service: HuntProgressService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HuntProgressService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
