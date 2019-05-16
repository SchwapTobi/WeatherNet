import {Component} from '@angular/core';
import {NavController, NavParams} from 'ionic-angular';


@Component({
  selector: 'page-weather-chart',
  templateUrl: 'weather-chart.html',
})
export class WeatherChartPage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad WeatherChartPage');
  }

}
