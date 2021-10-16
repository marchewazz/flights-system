import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';

import { CityAirportsService } from '../../services/city-airports.service';

@Component({
  selector: 'app-destination-form',
  templateUrl: './destination-form.component.html',
  styleUrls: ['./destination-form.component.scss']
})
export class DestinationFormComponent implements OnInit {

  originAirports : any;
  destinationAirports : any;
  originAirportsControl = new FormControl();
  destinationAirportsControl = new FormControl();
  dataProblem : string = '';
  flights : any[] = []

  constructor(private cas: CityAirportsService) {}

  ngOnInit(): void {}
  getAirports(city : string, whichCities : string) : void {
    if (city != ''){
      this.cas.getAirports(city).subscribe((res) => {
        if (whichCities == 'origin') {
          this.originAirports = res;
          this.originAirports = (this.originAirports.Places.length > 0 ? this.originAirports.Places : 'empty')
        }
        if (whichCities == 'destination') {
          this.destinationAirports = res;
          this.destinationAirports = (this.destinationAirports.Places.length > 0 ? this.destinationAirports.Places : 'empty')

        }
        console.log(this.originAirports, this.destinationAirports);
      });
    } else {
      if (whichCities == 'origin') this.originAirports = undefined
      if (whichCities == 'destination') this.destinationAirports = undefined
      console.log(this.originAirports, this.destinationAirports);
    }
  }

  checkPrices(){
    interface Flight{
      carriers : string[];
      dateTime : string;
      direct: boolean;
      moneyDetails : {
        price: number,
        code: string,
        symbol: string
      };
      originDetails : {
        cityName: string,
        airportName: string,
        airportCode: string,
        country: string
      };
      destinationDetails : {
        cityName: string,
        airportName: string,
        airportCode: string,
        country: string
      };
    } 

    const originAirports : string[] = this.originAirportsControl.value;
    const destinationAirports : string[] = this.destinationAirportsControl.value;
    console.log(originAirports, destinationAirports);
    
    if (originAirports !== null && destinationAirports !== null){
      var flights : Flight[] = []
      for (var originAirport of originAirports){
        for (var destinationAirport of destinationAirports){
          let originCode = originAirport.split("-")[0]
          let destinationCode = destinationAirport.split("-")[0]
          this.cas.getFlights(originAirport, destinationAirport).subscribe((res) => {
            const info : any = res
            console.log(info);
            if (info.Quotes.length !== 0){
              
              console.log(originAirport, originCode, destinationAirport, destinationCode);
              let originCity = {
                cityName: '',
                airportName: '',
                airportCode: '',
                country: ''
              };
              let destinationCity = {
                cityName: '',
                airportName: '',
                airportCode: '',
                country: ''
              };

              for (var place of info.Places){
                if (place.IataCode == originCode){
                  originCity = {
                    cityName: place.CityName,
                    airportName: place.Name,
                    airportCode: place.IataCode,
                    country: place.CountryName
                  }
                }
                if (place.IataCode == destinationCode){
                  destinationCity = {
                    cityName: place.CityName,
                    airportName: place.Name,
                    airportCode: place.IataCode,
                    country: place.CountryName
                  }
                }
              }

              flights.push({
              carriers : info.Carriers[0].Name,
              dateTime: info.Quotes[0].QuoteDateTime,
              direct: true,
              moneyDetails : {
                price: info.Routes[0].Price,
                code: info.Currencies[0].Code,
                symbol: info.Currencies[0].Symbol
              },
              originDetails: originCity,
              destinationDetails: destinationCity
            })
            } 
          })
        }
      }
      this.flights = flights
      console.log(this.flights);
    } else {
      this.dataProblem = "Missing airports";
      console.log(this.dataProblem);
    }
  }
}

