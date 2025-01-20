import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalMesaComponent } from './modal-mesa.component';

describe('ModalMesaComponent', () => {
  let component: ModalMesaComponent;
  let fixture: ComponentFixture<ModalMesaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ModalMesaComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ModalMesaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
