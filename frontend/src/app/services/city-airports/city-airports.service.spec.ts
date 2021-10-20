import { TestBed } from '@angular/core/testing';

import { CityAirportsService } from './city-airports.service';

describe('CityAirportsService', () => {
  let service: CityAirportsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CityAirportsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
