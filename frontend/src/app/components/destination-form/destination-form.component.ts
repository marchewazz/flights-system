import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';

import { CityAirportsService } from '../../services/city-airports/city-airports.service';
import { TicketSystemService } from 'src/app/services/ticket-system/ticket-system.service';
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
  flights : any[] = [];
  selectedTicketControl : any;
  ticketNameAndSurname = new FormControl();
  ticketEmail = new FormControl();

  constructor(private cas: CityAirportsService, private tss: TicketSystemService) {}

  ngOnInit(): void {}
  getAirports(city : string, whichCities : string) : void {
    //FUNCTION GETS AIRPORTS FOR SELECT OPTION
    //WHICHCITIES PARAMETER SAYS IF IT'S ORIGIN INPUT OR DESTINATION
    if (city != ''){
      this.cas.getAirports(city).subscribe((res) => {
        if (whichCities == 'origin') {
          this.originAirports = res;
          //RETURNS EMPTY IF THERE ARE NO AIRPORTS NEAR CITY
          this.originAirports = (this.originAirports.Places.length > 0 ? this.originAirports.Places : 'empty')
        }
        if (whichCities == 'destination') {
          this.destinationAirports = res;
          //RETURNS EMPTY IF THERE ARE NO AIRPORTS NEAR CITY
          this.destinationAirports = (this.destinationAirports.Places.length > 0 ? this.destinationAirports.Places : 'empty')

        }
        console.log(this.originAirports, this.destinationAirports);
      });
    } else {
      //IF NOTHING PASSED IT'S JUST UNDEFINED
      if (whichCities == 'origin') this.originAirports = undefined
      if (whichCities == 'destination') this.destinationAirports = undefined
      console.log(this.originAirports, this.destinationAirports);
    }
  }

  checkPrices(){
    //THIS FUNCTION JUST CHECKS PRICE FROM ORIGINS TO DESTINATIONS
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
    //THESE VARIABLES STORE VALUES FROM FORM CONTROL, THEY ARE CODES OF THE CHOOSED AIRPORTS
    console.log(originAirports, destinationAirports);
    
    if (originAirports !== null && destinationAirports !== null){
      var flights : Flight[] = []
      //LOOPING THROUGH ARRAYS OF ORIGIN AND DESTINATION AIRPORTS
      for (var originAirport of originAirports){
        for (var destinationAirport of destinationAirports){
          //THESE VARIABLES ARE AIRPORTS CODE WITHOUT '-sky'
          //IT'S BECAUSE IN DESTINATION DETAILS AND ORIGIN DETAILS CITIES ARE OFTEN IN DIFFRENT ORDER
          let originCode = originAirport.split("-")[0]
          let destinationCode = destinationAirport.split("-")[0]
          this.cas.getFlights(originAirport, destinationAirport).subscribe((res) => {
            //GETTING FLIGHT INFO
            const info : any = res
            console.log(info);
            if (info.Quotes.length !== 0){
              //IF WE GOT FLIGHT OPTION IN RESPONSE WE PUSH IT TO ARRAY FLIGHTS
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
      //AT THE END WE ARE ASSIGNING IT TO CLASS VARIABLE
      this.flights = flights
      console.log(this.flights);
    } else {
      //IF ONE OF ARRAYS IS EMPTY IT'S ERROR
      this.dataProblem = "Missing airports";
      console.log(this.dataProblem);
    }
  }
  order(event : any) {
    event.preventDefault()
    const selectedTicket = this.selectedTicketControl;
    const nameAndSurname = this.ticketNameAndSurname.value;
    const email = this.ticketEmail.value
    if (selectedTicket == undefined || nameAndSurname == null || email == null) {
      alert('wrong');
    } else {
      const ticket = {
        flight: selectedTicket,
        person: {
          email: email,
          nameAndSurname: nameAndSurname
        }
      }
      this.tss.generateTicket(ticket).subscribe((res) =>{
        const info : any = res
        console.log(info);
      })
    }
  }
}

