import { TestBed, inject } from '@angular/core/testing';

import { AprobacionService } from './aprobacion.service';

describe('AprobacionService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AprobacionService]
    });
  });

  it('should be created', inject([AprobacionService], (service: AprobacionService) => {
    expect(service).toBeTruthy();
  }));
});
