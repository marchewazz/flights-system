import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-airport-button',
  templateUrl: './airport-button.component.html',
  styleUrls: ['./airport-button.component.scss']
})
export class AirportButtonComponent implements OnInit {

  @Input() carrier = '';
  @Input() dateTime = '';
  @Input() originDetails = '';
  @Input() destinationDetails = '';
  @Input() price = '';

  constructor() { }

  ngOnInit(): void {
  }

}
