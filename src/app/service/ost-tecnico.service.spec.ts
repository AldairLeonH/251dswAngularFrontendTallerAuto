import { TestBed } from '@angular/core/testing';

import { OstTecnicoService } from './ost-tecnico.service';

describe('OstTecnicoService', () => {
  let service: OstTecnicoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OstTecnicoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
