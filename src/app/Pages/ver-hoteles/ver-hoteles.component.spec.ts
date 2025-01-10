import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VerHotelesComponent } from './ver-hoteles.component';

describe('VerHotelesComponent', () => {
  let component: VerHotelesComponent;
  let fixture: ComponentFixture<VerHotelesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [VerHotelesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(VerHotelesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
