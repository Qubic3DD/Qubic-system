import { TestBed } from '@angular/core/testing';

import { DarkModeServiceTsService } from './dark-mode.ts.service';

describe('DarkModeServiceTsService', () => {
  let service: DarkModeServiceTsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DarkModeServiceTsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
