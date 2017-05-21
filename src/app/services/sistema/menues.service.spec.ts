/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { MenuesService } from './menues.service';

describe('MenuesService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MenuesService]
    });
  });

  it('should ...', inject([MenuesService], (service: MenuesService) => {
    expect(service).toBeTruthy();
  }));
});
