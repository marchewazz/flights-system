import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GoogleMapsRedirectComponent } from './google-maps-redirect.component';

describe('GoogleMapsRedirectComponent', () => {
  let component: GoogleMapsRedirectComponent;
  let fixture: ComponentFixture<GoogleMapsRedirectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GoogleMapsRedirectComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GoogleMapsRedirectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
