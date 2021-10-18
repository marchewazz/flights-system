import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-google-maps-redirect',
  templateUrl: './google-maps-redirect.component.html',
  styleUrls: ['./google-maps-redirect.component.scss']
})
export class GoogleMapsRedirectComponent implements OnInit {

  @Input() airport : any;

  constructor() { }

  ngOnInit(): void {
  }
  openGoogleMaps() : void{
    window.open(`https://www.google.com/maps/search/?api=1&query=${this.airport.replace(" ", "+")}`)
  }
}
