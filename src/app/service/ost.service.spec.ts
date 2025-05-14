import { TestBed } from '@angular/core/testing';

import { OstService } from './ost.service';

describe('OstService', () => {
  let service: OstService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OstService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
