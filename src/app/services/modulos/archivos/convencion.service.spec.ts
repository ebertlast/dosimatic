import { TestBed, inject } from '@angular/core/testing';

import { ConvencionService } from './convencion.service';

describe('ConvencionService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ConvencionService]
    });
  });

  it('should be created', inject([ConvencionService], (service: ConvencionService) => {
    expect(service).toBeTruthy();
  }));
});
