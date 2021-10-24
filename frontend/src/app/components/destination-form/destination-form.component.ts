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

  dataProblem : string = "";
  flights : any[] = [];

  selectedTicketControl : any;
  ticketNameAndSurname = new FormControl();
  ticketEmail = new FormControl();
  ticketCurrency : string[] = ['USD', 'JPY', 'EUR', 'PLN', 'CAD', 'CHF', 'GBP', 'AUD', 'CNY', 'RUB'];
  ticketCurrencyControl = new FormControl();
  
  originCityControl = new FormControl();
  destinationCityControl = new FormControl();
  constructor(private cas: CityAirportsService, private tss: TicketSystemService) {
    this.ticketCurrencyControl.setValue(this.ticketCurrency[0])
  }

  ngOnInit(): void {}
  swapCities(){
    let origin = this.originCityControl.value;
    let destination = this.destinationCityControl.value;
    console.log(origin, destination);
    this.originCityControl.setValue(destination)
    this.destinationCityControl.setValue(origin)
    let newOrigin = this.originCityControl.value;
    let newDestination = this.destinationCityControl.value;
    if(newOrigin != null) this.getAirports(newOrigin, 'origin')
    if(newDestination != null) this.getAirports(newDestination, 'destination')
  }
  getAirports(city : string, whichCities : string) : void {
    //SOMETIMES THERE ARE CITIES IN RESPONSE AND THEY CAUSE BUGS THIS FUNCTION DELETES THEM
    function deleteCities(airports: any){
      for(var i = 0; i <= airports.length - 1; i++){
        let currentAirport = airports[i]
        if(currentAirport.CityId == currentAirport.PlaceId) airports.splice(i, 1)
      }
      return airports
    }
    //FUNCTION GETS AIRPORTS FOR SELECT OPTION
    //WHICHCITIES PARAMETER SAYS IF IT'S ORIGIN INPUT OR DESTINATION
    if (city != ""){
      this.cas.getAirports(city).subscribe((res) => {
        if (whichCities == 'origin') {
          this.originAirports = res;
          //RETURNS EMPTY IF THERE ARE NO AIRPORTS NEAR CITY
          this.originAirports = (this.originAirports.Places.length > 0 ? this.originAirports.Places : 'empty')
          if(this.originAirports != 'empty') deleteCities(this.originAirports)
        }
        if (whichCities == 'destination') {
          this.destinationAirports = res;
          //RETURNS EMPTY IF THERE ARE NO AIRPORTS NEAR CITY
          this.destinationAirports = (this.destinationAirports.Places.length > 0 ? this.destinationAirports.Places : 'empty')
          if(this.destinationAirports != 'empty') deleteCities(this.destinationAirports)
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
    const currency = this.ticketCurrencyControl.value;
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
          this.cas.getFlights(originAirport, destinationAirport, currency).subscribe((res) => {
            //GETTING FLIGHT INFO
            const info : any = res
            console.log(info);
            if (info.Quotes.length !== 0){
              //IF WE GOT FLIGHT OPTION IN RESPONSE WE PUSH IT TO ARRAY FLIGHTS
              console.log(originAirport, originCode, destinationAirport, destinationCode);
              let originCity = {
                cityName: "",
                airportName: "",
                airportCode: "",
                country: ""
              };
              let destinationCity = {
                cityName: "",
                airportName: "",
                airportCode: "",
                country: ""
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
              //SOMETIMES THERE'S ERROR WITH CITIES AND CITY DATA IS EMPTY STRING
              //THIS FUNCTIONS SOLVES THIS PROBLEM AND JUST DOESN'T PUSH CITY LIKE IT
              function isCityValid(city: any){
                for(var key in city){
                  if(city[key] == "") return false
                }
                return true
              }
              if(isCityValid(originCity) && isCityValid(destinationCity)){
                flights.push({
                carriers : info.Carriers[0].Name,
                //API RETURNS DEPARTURE DATE AS 0:00 SO ITS CONNECTING DEPARTURE DATE WITH QUOTE TIME TO GET DIFFERENT HOUR
                dateTime: info.Quotes[0].OutboundLeg.DepartureDate.split("T")[0]+"T"+info.Quotes[0].QuoteDateTime.split("T")[1],
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

  orderTicket(event : any) {
    event.preventDefault()
    const selectedTicket = this.selectedTicketControl;
    const nameAndSurname = this.ticketNameAndSurname.value;
    const email = this.ticketEmail.value

    function validateEmail(email: any) {
      const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      return re.test(email);
    }

    if (selectedTicket == undefined || nameAndSurname == null || email == null) {
      alert('Pass data');
    } else if(!validateEmail(email)){
      alert('Email isn\'t valid');
    } 
    else {
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
      alert(`Ticket is sent on email: ${email}`)
    }
  }
}

