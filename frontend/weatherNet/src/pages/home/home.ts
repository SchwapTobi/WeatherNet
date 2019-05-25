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

    let city = this.primaryLocation.name;
    let key1 = "currentWeatherIn" + city;
    let color;
    let currentTemp;

    let data = this.storage.get(key1).then(data => {
      currentTemp = data.main.temp_max;
      color = WeatherUTIL.getColorFromTemp(currentTemp);

    }).then(value => {
      this.cityColor = color;
      this.currentTemperature = currentTemp.toString().split(".")[0];
    });

    let key2 = "forecastWeatherIn" + city;
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

  round(num: any): number {
    return Math.round(num * 10) / 10;
  }

  loadForeCast() {
    this.forecastActivated = true;
    console.log(this.forecast)
  }

  //show App-infos
  presentPopover() {
    this.navCtrl.push(MorePage);
  }

  //return matching background video
  getVideoTheme(weatherAttribute: String): String {
    var url = "assets/video/sun_cloudy.mp4";
    switch (weatherAttribute) {
      case "clear sky":
        url = "assets/video/sun.mp4";
        break;
      case "few clouds":
        url = "assets/video/sun_cloudy.mp4";
        break;
      case "scattered clouds":
        url = "assets/video/clouds.mp4";
        break;
      case "broken clouds":
        url = "assets/video/clouds_2.mp4";
        break;
      case "shower rain":
        url = "assets/video/rain_heavy.mp4";
        break;
      case "rain":
        url = "assets/video/rain.mp4";
        break;
      case "thunderstorm":
        url = "assets/video/lightning.mp4";
        break;
      case "snow":
        url = "assets/video/snow.mp4";
        break;
      case "mist":
        url = "assets/video/fog.mp4";
        break;
    }
    return url;
  }

  showCityDetails(city: NetLocation) {
    this.navCtrl.push(CityDetailsPage, {
      'city': city
    })
  }


  getIconForWeather(weatherAttribute: String): String {
    var name = "sunny";
    switch (weatherAttribute) {
      case "clear sky":
        name = "sunny";
        break;
      case "few clouds":
        name = "partly-sunny";
        break;
      case "scattered clouds":
        name = "cloudy";
        break;
      case "broken clouds":
        name = "cloudy";
        break;
      case "shower rain":
        name = "rainy";
        break;
      case "rain":
        name = "rainy";
        break;
      case "thunderstorm":
        name = "flash";
        break;
      case "snow":
        name = "snow";
        break;
      case "mist":
        name = "cloudy";
        break;
    }
    return name;

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
