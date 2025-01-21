import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CrudLugarComponent } from './crud-lugar.component';

describe('CrudLugarComponent', () => {
  let component: CrudLugarComponent;
  let fixture: ComponentFixture<CrudLugarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CrudLugarComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CrudLugarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
