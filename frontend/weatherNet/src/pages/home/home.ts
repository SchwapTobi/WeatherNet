import {Component} from '@angular/core';
import {NavController} from 'ionic-angular';

import {MorePage} from "../more/more";
import {AngularFireDatabase} from '@angular/fire/database';
import {Storage} from "@ionic/storage";

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})

export class HomePage {
  allObjects = [];

  weatherNodes: Array<any> = [];

  constructor(public navCtrl: NavController, private afDatabase: AngularFireDatabase, private storage: Storage) {
    this.loadWeatherStations();
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

  //fetch stations from database
  private loadWeatherStations() {
    this.afDatabase.list('/stations/').valueChanges().subscribe(res => {
      this.weatherNodes = res;
      this.storage.set('weatherNodes', this.weatherNodes);
    });

  }
}
