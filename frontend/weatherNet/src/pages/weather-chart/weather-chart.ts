import {Component, ElementRef, ViewChild} from '@angular/core';
import {NavController, NavParams} from 'ionic-angular';
import {BaseChartDirective} from "ng2-charts-x";


@Component({
  selector: 'page-weather-chart',
  templateUrl: 'weather-chart.html',
})
export class WeatherChartPage {
  @ViewChild('map') mapElement: ElementRef;
  @ViewChild("baseChart")

  chart: BaseChartDirective;
  data: Array<any>;
  labels: Array<any>;

  lineChartColors: Array<any> = [
    {
      backgroundColor: 'rgba(66, 165, 244,0.2)',
      borderColor: 'rgba(25, 118, 210,1)',
      pointBackgroundColor: 'rgba(25, 72, 210,1)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#4863A0',
      pointHoverBorderColor: 'rgba(77,83,96,1)'
    },
  ];
  lineChartLegend: boolean = false;
  lineChartType: string = 'line';
  description: string;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.description = this.navParams.get('desc');
    this.data = this.navParams.get('data');
    this.labels = this.navParams.get('labels');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad WeatherChartPage');
  }

  closeModal() {
    this.navCtrl.pop();
  }

}
