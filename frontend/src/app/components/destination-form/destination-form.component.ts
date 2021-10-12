import { Component, OnInit } from '@angular/core';
import { CityAirportsService } from '../../services/city-airports.service';
import { AirportButtonComponent } from '../airport-button/airport-button.component';
@Component({
  selector: 'app-destination-form',
  templateUrl: './destination-form.component.html',
  styleUrls: ['./destination-form.component.scss']
})
export class DestinationFormComponent implements OnInit {

  originAirports : any;
  destinationAirports : any;

  constructor(private cas: CityAirportsService) { }

  ngOnInit(): void {}

  getAirports(city : string, whichCities : string) : void {
    if (city != ''){
      this.cas.getAirports(city).subscribe((res) => {
        if (whichCities == 'origin') {
          this.originAirports = res;
          this.originAirports = (this.originAirports.Places.length > 0 ? this.originAirports = this.originAirports.Places : 'empty')
        }
        if (whichCities == 'destination') {
          this.destinationAirports = res;
          this.destinationAirports = (this.destinationAirports.Places.length > 0 ? this.destinationAirports = this.destinationAirports.Places : 'empty')

        }
        console.log(this.originAirports, this.destinationAirports);
      });
    } else {
      if (whichCities == 'origin') this.originAirports = undefined
      if (whichCities == 'destination') this.destinationAirports = undefined
      console.log(this.originAirports, this.destinationAirports);
    }
  }
}
