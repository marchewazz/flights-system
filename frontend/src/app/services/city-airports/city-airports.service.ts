import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { apiKey } from '../apiKey';

const httpOptions = {
  headers: new HttpHeaders({
    "x-rapidapi-host": "skyscanner-skyscanner-flight-search-v1.p.rapidapi.com",
		"x-rapidapi-key": apiKey
  }),
};

@Injectable({
  providedIn: 'root'
})

export class CityAirportsService {
  
  constructor(private http: HttpClient) {}

  getAirports(place : string): Observable<Object>{
    const apiUrl = `https://skyscanner-skyscanner-flight-search-v1.p.rapidapi.com/apiservices/autosuggest/v1.0/US/USD/en-US/?query=${place}`
    return this.http.get(apiUrl, httpOptions)
  }

  getFlights(origin : string, destination : string, currency: string) : Observable<Object>{
    var todayDate = new Date().toISOString().slice(0, 10);
    console.log(todayDate);
    
    const apiUrl = `https://skyscanner-skyscanner-flight-search-v1.p.rapidapi.com/apiservices/browseroutes/v1.0/US/${currency}/en-US/${origin}/${destination}/${todayDate}`
    return this.http.get(apiUrl, httpOptions)
  }
}


