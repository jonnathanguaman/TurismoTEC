import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CrudRestauranteComponent } from './crud-restaurante.component';

describe('CrudRestauranteComponent', () => {
  let component: CrudRestauranteComponent;
  let fixture: ComponentFixture<CrudRestauranteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CrudRestauranteComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CrudRestauranteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
