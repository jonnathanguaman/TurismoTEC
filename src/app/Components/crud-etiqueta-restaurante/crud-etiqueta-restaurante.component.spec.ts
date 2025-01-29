import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CrudEtiquetaRestauranteComponent } from './crud-etiqueta-restaurante.component';

describe('CrudEtiquetaRestauranteComponent', () => {
  let component: CrudEtiquetaRestauranteComponent;
  let fixture: ComponentFixture<CrudEtiquetaRestauranteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CrudEtiquetaRestauranteComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CrudEtiquetaRestauranteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
