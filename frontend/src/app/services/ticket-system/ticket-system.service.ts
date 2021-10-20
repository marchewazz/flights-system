import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TicketSystemService {

  constructor(private http: HttpClient) { }

  generateTicket(ticket: any){
    return this.http.post('http://localhost:8000/flights/generate/', ticket)
  }
}
