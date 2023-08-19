import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { HttpClientModule } from '@angular/common/http'; //map
import { ReactiveFormsModule } from '@angular/forms'; //location-form
import { CommonModule } from '@angular/common'; //form
import { LocationFormComponent } from './location-form/location-form.component';



@NgModule({
  declarations: [AppComponent, LocationFormComponent],
  imports: [CommonModule, BrowserModule, IonicModule.forRoot(), AppRoutingModule, HttpClientModule, ReactiveFormsModule],
  providers: [{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy }],
  bootstrap: [AppComponent],
})
export class AppModule { }
