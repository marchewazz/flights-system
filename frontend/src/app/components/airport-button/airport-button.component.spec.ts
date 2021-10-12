import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AirportButtonComponent } from './airport-button.component';

describe('AirportButtonComponent', () => {
  let component: AirportButtonComponent;
  let fixture: ComponentFixture<AirportButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AirportButtonComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AirportButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
