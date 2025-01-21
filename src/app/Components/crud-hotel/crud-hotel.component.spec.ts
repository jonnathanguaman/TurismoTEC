import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CrudHotelComponent } from './crud-hotel.component';

describe('CrudHotelComponent', () => {
  let component: CrudHotelComponent;
  let fixture: ComponentFixture<CrudHotelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CrudHotelComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CrudHotelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
