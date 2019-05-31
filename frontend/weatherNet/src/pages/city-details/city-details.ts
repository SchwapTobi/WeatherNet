import {Component, ElementRef, ViewChild} from '@angular/core';
import {AlertController, ModalController, NavController, NavParams} from 'ionic-angular';
import {BaseChartDirective} from "ng2-charts-x";
import {Storage} from "@ionic/storage";
import {AngularFireDatabase} from '@angular/fire/database';
import {NetLocation} from "../../model/position/location";
import {WeatherChartPage} from "../weather-chart/weather-chart";
import {WeatherUTIL} from "../../model/weather/weatherUTIL";

declare var google;

@Component({
  selector: 'page-city-details',
  templateUrl: 'city-details.html',
})
export class CityDetailsPage {
  @ViewChild('map') mapElement: ElementRef;
  @ViewChild("baseChart")
  chart: BaseChartDirective;
  temperatures: Array<any> = [{data: [], label: 'Temperatur'}];
  humidities: Array<any> = [{data: [], label: 'Luftfeuchtigkeit'}];
  downfall: Array<any> = [{data: [], label: 'Niederschlag'}];
  pressures: Array<any> = [{data: [], label: 'Luftdruck'}];

  lineChartLabels: Array<any> = [];

  tempChartLabels: Array<any> = [];
  humChartLabels: Array<any> = [];
  pressureChartLabels: Array<any> = [];
  downfallChartLabels: Array<any> = [];

  lineChartLegend: boolean = false;
  lineChartType: string = 'line';

  finishedLoading: boolean;
  map: any;

  city: NetLocation;

  forecast: Array<any> = [];

  currentWeather: any;

  storageKey: string;

  forecastActivated: boolean;

  constructor(public navCtrl: NavController, public navParams: NavParams, private storage: Storage, private afDatabase: AngularFireDatabase, public modalCtrl: ModalController, public alertCtrl: AlertController) {
    this.forecastActivated = false;
    this.city = this.navParams.get('city');

    this.storageKey = "forecastWeatherIn" + this.city.name + this.city.zipCode;


    let forecast = [];
    let forecastLoader = this.storage.get(this.storageKey).then(data => {
      forecast.push(data);
    }).then(value => {
      this.currentWeather = forecast[0][0];
      // console.log(this.currentWeather)
      if (this.currentWeather) {
        this.curretWeatherLoaded();
      } else {
        let forecastLoader = this.storage.get(this.storageKey).then(data => {
          forecast.push(data);
        }).then(value => {
          this.currentWeather = forecast[0][0];
          // console.log(this.currentWeather)
          if (this.currentWeather) {
            this.curretWeatherLoaded();
          }
        });
      }
    });

  }

  curretWeatherLoaded() {
    this.forecastActivated = true;
    // console.log(this.forecast)
  }


  round(num: any): number {
    return Math.round(num * 10) / 10;
  }

  getIconForWeather(weatherAttribute: String): String {
    return WeatherUTIL.getIconForWeather(weatherAttribute);
  }

  getColorForWeather(weatherAttribute: String): String {
    // console.log(weatherAttribute);
    return WeatherUTIL.getIconColorForWeather(weatherAttribute);
  }

  getColor(temp: any): string {
    return WeatherUTIL.getColorFromTemp(temp);
  }


  ionViewDidLoad() {
    this.loadMap();
    // console.log("opened city details page")
    this.getLogs();
  }

  loadMap() {
    let mapOptions = {
      center: new google.maps.LatLng(this.city.latitude, this.city.longitude),
      zoom: 12,
      mapTypeId: 'roadmap',
      disableDefaultUI: true,
      scaleControl: false,
      zoomControl: false,
      styles: [
        {
          "featureType": "administrative",
          "elementType": "geometry",
          "stylers": [
            {
              "visibility": "off"
            }
          ]
        },
        {
          "featureType": "poi",
          "elementType": "labels.text",
          "stylers": [
            {
              "visibility": "off"
            }
          ]
        },
        {
          "featureType": "road.highway",
          "elementType": "labels",
          "stylers": [
            {
              "visibility": "off"
            }
          ]
        },
        {
          "featureType": "transit",
          "stylers": [
            {
              "visibility": "off"
            }
          ]
        },
        {
          "featureType": "road",
          "elementType": "labels.icon",
          "stylers": [
            {
              "visibility": "off"
            }
          ]
        },
        {
          "featureType": "road.arterial",
          "elementType": "labels",
          "stylers": [
            {
              "visibility": "off"
            }
          ]
        },
        {
          "featureType": "road.highway",
          "elementType": "labels",
          "stylers": [
            {
              "visibility": "off"
            }
          ]
        },
        {
          "featureType": "road.local",
          "stylers": [
            {
              "visibility": "off"
            }
          ]
        },
        {
          "featureType": "road.local",
          "elementType": "labels",
          "stylers": [
            {
              "visibility": "off"
            }
          ]
        }
      ]
    }

    this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);

    this.addLocationMarker(this.map);
  }

  //add marker for current weatherNode
  addLocationMarker(map: any) {
    let marker = new google.maps.Marker({
      position: new google.maps.LatLng(this.city.latitude, this.city.longitude),
      map: map,
      icon: 'http://maps.google.com/mapfiles/ms/icons/red.png',
    });
  }

  //get forecast from localStorage
  getLogs() {
    // console.log("opened getLogs")
    let data = this.storage.get(this.storageKey).then(data => {
      this.forecast = data;
      this.processForecast();
    });

  }

  //get forecast from localStorage
  getLogsWithoutProcessing() {
    let data = this.storage.get(this.storageKey).then(data => {
      this.forecast = data;
    });
  }

  processForecast() {
    let lables: Array<any> = [];
    let temps: Array<any> = [];
    let humidities: Array<any> = [];
    let downfall: Array<any> = [];
    let pressures: Array<any> = [];

    let i = 0;
    for (let item of this.forecast) {
      lables.push(item.dt_txt);
      temps.push(item.main.temp);
      humidities.push(item.main.humidity);
      if (item.rain) {
        // @ts-ignore
        downfall.push(item.rain["3h"]);
      } else {
        downfall.push(0);
      }
      //fix undefined values in chart
      if (!downfall[i] || downfall[i] === undefined) {
        downfall.push(0);
      }
      pressures.push(item.main.pressure);
      i++;
    }

    this.lineChartLabels = lables;

    //labels for individual scalings
    this.tempChartLabels = lables;
    this.humChartLabels = lables;
    this.downfallChartLabels = lables;
    this.pressureChartLabels = lables;

    this.temperatures[0].data = (temps);
    this.humidities[0].data = (humidities);
    this.downfall[0].data = (downfall);
    this.pressures[0].data = (pressures);
  }

  processSelectedLogs(desc: string) {
    let lables: Array<any> = [];
    let temps: Array<any> = [];
    let humidities: Array<any> = [];
    let downfall: Array<any> = [];
    let pressures: Array<any> = [];

    let i = 0;
    for (let item of this.forecast) {
      lables.push(item.dt_txt);
      temps.push(item.main.temp);
      humidities.push(item.main.humidity);
      if (item.rain) {
        // @ts-ignore
        downfall.push(item.rain["3h"]);
      } else {
        downfall.push(0);
      }
      //fix undefined values in chart
      if (!downfall[i] || downfall[i] === undefined) {
        downfall.push(0);
      }
      pressures.push(item.main.pressure);
      i++;
    }

    this.lineChartLabels = lables;

    if (desc.toLocaleLowerCase() == "luftdruck") {
      this.pressureChartLabels = lables;
      this.pressures[0].data = (pressures);
    } else if (desc.toLocaleLowerCase() == "luftfeuchtigkeit") {
      this.humChartLabels = lables;
      this.humidities[0].data = (humidities);
    } else if (desc.toLocaleLowerCase() == "temperatur") {
      this.tempChartLabels = lables;
      this.temperatures[0].data = (temps);
    } else if (desc.toLocaleLowerCase() == "niederschlag") {
      this.downfallChartLabels = lables;
      this.downfall[0].data = (downfall);
    }
  }

  //full-screen diagram
  expandChart(desc: string, data: any, labels: any) {
    const modal = this.modalCtrl.create(WeatherChartPage, {'desc': desc, 'data': data, 'labels': labels});
    modal.present();
  }

  //select time span for displayed data
  changeRepresentationByTime(desc: string, data: any, labels: any) {
    //relaod selected chart, do not change others
    this.getLogsWithoutProcessing();
    this.processSelectedLogs(desc);

    if (desc.toLocaleLowerCase() == "luftdruck") {
      data = this.pressures;
      labels = this.pressureChartLabels;
    } else if (desc.toLocaleLowerCase() == "luftfeuchtigkeit") {
      data = this.humidities;
      labels = this.humChartLabels;
    } else if (desc.toLocaleLowerCase() == "temperatur") {
      data = this.temperatures;
      labels = this.tempChartLabels;
    } else if (desc.toLocaleLowerCase() == "niederschlag") {
      data = this.downfall;
      labels = this.downfallChartLabels;
    }

    let alert = this.alertCtrl.create();
    alert.setTitle('Darstellung ändern');
    alert.setSubTitle('Zeitraum wählen')

    alert.addInput({
      type: 'radio',
      label: 'Nächsten 6 Stunden',
      value: 'six',
      checked: false
    });

    alert.addInput({
      type: 'radio',
      label: 'Nächsten 24 Stunden',
      value: 'day',
      checked: false
    });

    alert.addInput({
      type: 'radio',
      label: 'Nächsten 2 Tage',
      value: '3day',
      checked: false
    });


    alert.addInput({
      type: 'radio',
      label: 'Nächste Woche',
      value: 'week',
      checked: false
    });

    let newData: Array<any> = [{data: [], label: desc}];
    let newLineChartLabels: Array<any> = [];

    alert.addButton('Abbrechen');
    alert.addButton({
      text: 'OK',
      handler: res => {

        //time constants in ms
        var ONE_HOUR = 60 * 60 * 1000;
        var ONE_DAY = 60 * 60 * 1000 * 24;
        var ONE_WEEK = 60 * 60 * 1000 * 24 * 7;

        let index = 0;

        if (res == 'six') {
          for (let i = 0; i < labels.length; i++) {
            let label = labels[i];
            //split timestamp
            let year = label.substring(0, 4).trim();
            let month = label.substring(5, 7).trim();
            let day = label.substring(8, 11).trim();
            let hour = label.substring(11, 13).trim();
            let minute = label.substring(14, 16).trim();

            //YYYY-MM-DDTHH:MM:SS
            let isoDATE = year + '-' + month + '-' + day + ':' + hour + ':' + minute + ':00';
            let labelDate = new Date(isoDATE).getTime();

            //get current date
            let currentDate = new Date().getTime();

            //only use data from the next 6 hours
            if ((labelDate - currentDate) < ONE_HOUR * 6) {
              newData[0].data[index++] = data[0].data[i];
              let temp = isoDATE.toString();
              //dont show full date on every label
              newLineChartLabels.push(temp.substring(11, 16));
            }
          }
          this.saveChangedRepresentation(desc, newData, newLineChartLabels);

        } else if (res == 'day') {
          for (let i = 0; i < labels.length; i++) {
            let label = labels[i];
            //split timestamp
            let year = label.substring(0, 4).trim();
            let month = label.substring(5, 7).trim();
            let day = label.substring(8, 11).trim();
            let hour = label.substring(11, 13).trim();
            let minute = label.substring(14, 16).trim();

            //YYYY-MM-DDTHH:MM:SS
            let isoDATE = year + '-' + month + '-' + day + ':' + hour + ':' + minute + ':00';
            let labelDate = new Date(isoDATE).getTime();

            //get current date
            let currentDate = new Date().getTime();

            //only use data from the next 24 hours
            if ((labelDate - currentDate) < ONE_DAY) {
              newData[0].data[index++] = data[0].data[i];
              let temp = isoDATE.toString();
              //dont show full date on every label
              newLineChartLabels.push(temp.substring(11, 16));
            }
          }
          this.saveChangedRepresentation(desc, newData, newLineChartLabels);

        } else if (res == '3day') {
          for (let i = 0; i < labels.length; i++) {
            let label = labels[i];
            //split timestamp
            let year = label.substring(0, 4).trim();
            let month = label.substring(5, 7).trim();
            let day = label.substring(8, 11).trim();
            let hour = label.substring(11, 13).trim();
            let minute = label.substring(14, 16).trim();

            //YYYY-MM-DDTHH:MM:SS
            let isoDATE = year + '-' + month + '-' + day + ':' + hour + ':' + minute + ':00';
            let labelDate = new Date(isoDATE).getTime();

            //get current date
            let currentDate = new Date().getTime();

            //only use data from the next 3 days
            if ((labelDate - currentDate) < ONE_DAY * 3) {
              newData[0].data[index++] = data[0].data[i];
              let temp = isoDATE.toString();
              //dont show full date on every label
              if ((i > 0) && (newLineChartLabels[i - 1].substring(0, 9) == temp.substring(0, 9))) {
                newLineChartLabels.push(temp.substring(11, 16));
              } else {
                newLineChartLabels.push(temp.substring(0, 16));
              }
            }
          }
          this.saveChangedRepresentation(desc, newData, newLineChartLabels);

        } else if (res == 'week') {
          for (let i = 0; i < labels.length; i++) {
            let label = labels[i];
            //split timestamp
            let year = label.substring(0, 4).trim();
            let month = label.substring(5, 7).trim();
            let day = label.substring(8, 11).trim();
            let hour = label.substring(11, 13).trim();
            let minute = label.substring(14, 16).trim();

            //YYYY-MM-DDTHH:MM:SS
            let isoDATE = year + '-' + month + '-' + day + ':' + hour + ':' + minute + ':00';
            let labelDate = new Date(isoDATE).getTime();

            //get current date
            let currentDate = new Date().getTime();

            //only use data from the last 7 days
            if ((labelDate - currentDate) < ONE_WEEK) {
              newData[0].data[index++] = data[0].data[i];
              //inline tostring does not work..
              let temp = isoDATE.toString();
              //dont show full date on every label
              if ((i > 0) && (newLineChartLabels[i - 1].substring(0, 9) == temp.substring(0, 9))) {
                newLineChartLabels.push(temp.substring(11, 16));
              } else {
                newLineChartLabels.push(temp.substring(0, 16));
              }
            }
          }
          // console.log(newLineChartLabels)
          this.saveChangedRepresentation(desc, newData, newLineChartLabels);

        } else {

        }

      }
    });
    alert.present();
  }

  //update the corresponding data set
  saveChangedRepresentation(desc: string, newData: any, newLineChartLabels: any) {
    // console.log(newData);
    if (desc.toLocaleLowerCase() == "luftdruck") {
      this.pressures = newData;
      this.pressureChartLabels = newLineChartLabels;
    } else if (desc.toLocaleLowerCase() == "luftfeuchtigkeit") {
      this.humidities = newData;
      this.humChartLabels = newLineChartLabels;
    } else if (desc.toLocaleLowerCase() == "temperatur") {
      this.temperatures = newData;
      this.tempChartLabels = newLineChartLabels;
    } else if (desc.toLocaleLowerCase() == "niederschlag") {
      this.downfall = newData;
      this.downfallChartLabels = newLineChartLabels;
    }
  }
}
