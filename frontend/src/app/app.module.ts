import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DestinationFormComponent } from './components/destination-form/destination-form.component';
import { AirportButtonComponent } from './components/airport-button/airport-button.component';
import { GoogleMapsRedirectComponent } from './components/google-maps-redirect/google-maps-redirect.component';

@NgModule({
  declarations: [
    AppComponent,
    DestinationFormComponent,
    AirportButtonComponent,
    GoogleMapsRedirectComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
