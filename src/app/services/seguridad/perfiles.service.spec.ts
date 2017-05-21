/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { PerfilesService } from './perfiles.service';

describe('PerfilesService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PerfilesService]
    });
  });

  it('should ...', inject([PerfilesService], (service: PerfilesService) => {
    expect(service).toBeTruthy();
  }));
});
