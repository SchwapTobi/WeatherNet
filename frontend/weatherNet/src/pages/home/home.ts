import {Component} from '@angular/core';
import {NavController} from 'ionic-angular';

import {MorePage} from "../more/more";
import {AngularFireDatabase} from '@angular/fire/database';
import {Storage} from "@ionic/storage";
import {WeatherUTIL} from "../../model/weather/weatherUTIL";
import {DomSanitizer} from "@angular/platform-browser";
import {NetLocation} from "../../model/position/location";
import {CityDetailsPage} from "../city-details/city-details";

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})

export class HomePage {
  allObjects = [];

  weatherNodes: Array<any> = [];

  cityColor = '#f5f5f5';
  currentTemperature: number;
  currentWeather: string;

  forecast: any;

  forecastActivated: boolean;

  primaryLocation: NetLocation = {
    'id': null,
    'latitude': 48.3060922,
    'longitude': 14.2863136,
    'zipCode': "4020",
    'name': "Linz",
    'state': "Oberösterreich",
    'country': "AT"
  };

  constructor(public navCtrl: NavController, private afDatabase: AngularFireDatabase, private storage: Storage, private sanitizer: DomSanitizer) {


    this.forecastActivated = false;
    this.loadWeatherStations();

    let key1 = "currentWeatherIn" + this.primaryLocation.name + this.primaryLocation.zipCode;
    let color;
    let currentTemp;
    let currentWeather;

    let data = this.storage.get(key1).then(data => {
      currentTemp = data.main.temp_max;
      currentWeather = data.weather[0].description;
      color = WeatherUTIL.getColorFromTemp(currentTemp);

    }).then(value => {
      this.cityColor = color;
      this.currentTemperature = currentTemp.toString().split(".")[0];
      this.currentWeather = currentWeather;
      // console.log(this.currentWeather)
    });

    let key2 = "forecastWeatherIn" + this.primaryLocation.name + this.primaryLocation.zipCode;
    let forecast = [];
    let forecastLoader = this.storage.get(key2).then(data => {
      forecast.push(data);

    }).then(value => {
      this.forecast = forecast;
      this.loadForeCast();
    });
  }

  ionViewDidLoad() {

  }

  round(num: any): string {
    return (Math.round(num * 10) / 10).toFixed(1);
  }

  loadForeCast() {
    this.forecastActivated = true;
    // console.log(this.forecast)
  }

  //show App-infos
  presentPopover() {
    this.navCtrl.push(MorePage);
  }

  //return matching background video
  getVideoTheme(weatherAttribute: String): String {
    // console.log(weatherAttribute);
    return WeatherUTIL.getVideoTheme(weatherAttribute)
  }

  showCityDetails(city: NetLocation) {
    this.navCtrl.push(CityDetailsPage, {
      'city': city
    })
  }

  getIconColorForWeather(weatherAttribute: String): String {
    return WeatherUTIL.getIconColorForWeather(weatherAttribute);
  }

  getIconForWeather(weatherAttribute: String): String {
    return WeatherUTIL.getIconForWeather(weatherAttribute);
  }

  getColor(temp: any): string {
    return WeatherUTIL.getColorFromTemp(temp);
  }

  //fetch stations from database
  private loadWeatherStations() {
    this.afDatabase.list('/stations/').valueChanges().subscribe(res => {
      this.weatherNodes = res;
      this.storage.set('weatherNodes', this.weatherNodes);
    });
  }

}
