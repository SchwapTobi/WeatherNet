import {Component} from '@angular/core';
import {Platform} from 'ionic-angular';
import {StatusBar} from '@ionic-native/status-bar';
import {SplashScreen} from '@ionic-native/splash-screen';

import {TabsPage} from '../pages/tabs/tabs';
import {WeatherLoader} from "../model/weather/loader";
import {Storage} from "@ionic/storage";

@Component({
  templateUrl: 'app.html'
})
export class WeatherNetAPP {
  rootPage: any = TabsPage;

  //load capitalWeatherData
  weatherLoader: WeatherLoader = new WeatherLoader(this.storage);

  constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen, private storage: Storage) {
    this.storage.set('read', false);
    platform.ready().then(() => {
      statusBar.styleDefault();
      // splashScreen.hide();
    });

    console.log(this.weatherLoader.capitalWeatherData[0]);
  }
}
