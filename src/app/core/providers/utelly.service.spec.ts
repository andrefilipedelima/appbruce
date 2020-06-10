import { TestBed } from '@angular/core/testing';

import { UtellyService } from './utelly.service';

describe('UtellyService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  xit('should be created', () => {
    const service: UtellyService = TestBed.get(UtellyService);
    expect(service).toBeTruthy();
  });
});
