import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title: any;

  constructor(private http : HttpClient){}

  ngOnInit() : void {
    this.http.get<any>('http://127.0.0.1:8000/flights/main/')
    .subscribe(res => {
      this.title = res.message
    })
  }
}
