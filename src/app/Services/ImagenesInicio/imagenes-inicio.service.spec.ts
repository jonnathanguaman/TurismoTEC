import { TestBed } from '@angular/core/testing';

import { ImagenesInicioService } from './imagenes-inicio.service';

describe('ImagenesInicioService', () => {
  let service: ImagenesInicioService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ImagenesInicioService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
