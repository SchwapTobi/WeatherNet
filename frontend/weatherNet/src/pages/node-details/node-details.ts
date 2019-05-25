import {Component, ElementRef, ViewChild} from '@angular/core';
import {AlertController, ModalController, NavController, NavParams} from 'ionic-angular';
import {Storage} from "@ionic/storage";
import {AngularFireDatabase} from '@angular/fire/database';
import {BaseChartDirective} from "ng2-charts-x";
import {CONSTANTS} from "../../app/appConstants";
import {WeatherChartPage} from "../weather-chart/weather-chart";

declare var google;

@Component({
  selector: 'page-node-details',
  templateUrl: 'node-details.html',
})
export class NodeDetailsPage {
  @ViewChild('map') mapElement: ElementRef;
  @ViewChild("baseChart")
  chart: BaseChartDirective;
  temperatures: Array<any> = [{data: [], label: 'Temperatur'}];
  humidities: Array<any> = [{data: [], label: 'Luftfeuchtigkeit'}];
  brightnesses: Array<any> = [{data: [], label: 'Helligkeit'}];
  pressures: Array<any> = [{data: [], label: 'Luftdruck'}];

  lineChartLabels: Array<any> = [];

  tempChartLabels: Array<any> = [];
  humChartLabels: Array<any> = [];
  pressureChartLabels: Array<any> = [];
  brightChartLabels: Array<any> = [];


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

  nodeID: string;
  weatherNode: any;
  finishedLoading: boolean;
  map: any;
  nodeLogs: Array<any> = [];

  constructor(public navCtrl: NavController, public navParams: NavParams, private storage: Storage, private afDatabase: AngularFireDatabase, public modalCtrl: ModalController, public alertCtrl: AlertController) {
    this.finishedLoading = false;
    this.weatherNode = this.navParams.get('node');
    this.nodeID = this.weatherNode.nodeID;
    this.getLogs();
    console.log(this.weatherNode.position);
    this.finishedLoading = true;
  }


  ionViewDidLoad() {
    this.loadMap();
  }

  loadMap() {
    let mapOptions = {
      center: new google.maps.LatLng(this.weatherNode.position.latitude, this.weatherNode.position.longitude),
      zoom: 15,
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
      position: new google.maps.LatLng(this.weatherNode.position.latitude, this.weatherNode.position.longitude),
      map: map,
      icon: 'http://maps.google.com/mapfiles/ms/icons/red.png',
    });
  }

  //get logs from firebase
  getLogs() {
    this.afDatabase.list('/logs/"' + this.nodeID + '"').valueChanges().subscribe(res => {
      this.nodeLogs = res;
      this.processLogs();
    });
  }

  //get logs from firebase
  getLogsWithoutProcessing() {
    this.afDatabase.list('/logs/"' + this.nodeID + '"').valueChanges().subscribe(res => {
      this.nodeLogs = res;
    });
  }

  //get measuremnts from log
  processLogs() {
    //"2019-05-14T13:05:34.750567"
    let lables: Array<any> = [];
    let temps: Array<any> = [];
    let humidities: Array<any> = [];
    let brightnesses: Array<any> = [];
    let pressures: Array<any> = [];

    for (let item of this.nodeLogs) {
      lables.push(item.timestamp.toString().substring(0, 10) + " " + item.timestamp.toString().substring(11, 16));
      temps.push(item.temperature);
      humidities.push(item.humidity.toString().replace('%', ''));
      brightnesses.push(CONSTANTS.BRIGHTNESS_MAXIMUM - item.brightness);
      pressures.push(item.pressure);

    }

    this.lineChartLabels = lables;

    //labels for individual scalings
    this.tempChartLabels = lables;
    this.humChartLabels = lables;
    this.brightChartLabels = lables;
    this.pressureChartLabels = lables;

    this.temperatures[0].data = (temps);
    this.humidities[0].data = (humidities);
    this.brightnesses[0].data = (brightnesses);
    this.pressures[0].data = (pressures);

  }

  //get measuremnts from log
  processSelectedLogs(desc: string) {
    let lables: Array<any> = [];
    let temps: Array<any> = [];
    let humidities: Array<any> = [];
    let brightnesses: Array<any> = [];
    let pressures: Array<any> = [];

    for (let item of this.nodeLogs) {
      lables.push(item.timestamp.toString().substring(0, 10) + " " + item.timestamp.toString().substring(11, 16));
      temps.push(item.temperature);
      humidities.push(item.humidity.toString().replace('%', ''));
      brightnesses.push(CONSTANTS.BRIGHTNESS_MAXIMUM - item.brightness);
      pressures.push(item.pressure);

    }

    if (desc.toLocaleLowerCase() == "luftdruck") {
      this.pressureChartLabels = lables;
      this.pressures[0].data = (pressures);
    } else if (desc.toLocaleLowerCase() == "luftfeuchtigkeit") {
      this.humChartLabels = lables;
      this.humidities[0].data = (humidities);
    } else if (desc.toLocaleLowerCase() == "temperatur") {
      this.tempChartLabels = lables;
      this.temperatures[0].data = (temps);
    } else if (desc.toLocaleLowerCase() == "helligkeit") {
      this.brightChartLabels = lables;
      this.brightnesses[0].data = (brightnesses);
    }
  }

  //reformat array of sensors (inline html regex does not work..)
  formatList(sensors: any): string {
    return sensors.toString().replace(/,/g, ", ");
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
    } else if (desc.toLocaleLowerCase() == "helligkeit") {
      data = this.brightnesses;
      labels = this.brightChartLabels;
    }

    let alert = this.alertCtrl.create();
    alert.setTitle('Darstellung ändern');
    alert.setSubTitle('Zeitraum wählen')

    alert.addInput({
      type: 'radio',
      label: 'Letzte 3 Stunden',
      value: 'three',
      checked: false
    });

    alert.addInput({
      type: 'radio',
      label: 'Letzte 6 Stunden',
      value: 'six',
      checked: false
    });

    alert.addInput({
      type: 'radio',
      label: 'Letzter Tag',
      value: 'day',
      checked: false
    });

    alert.addInput({
      type: 'radio',
      label: 'Letzte 3 Tage',
      value: '3day',
      checked: false
    });


    alert.addInput({
      type: 'radio',
      label: 'Letzte Woche',
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

        if (res == 'three') {
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

            //only use data from the last 3 hours
            if ((currentDate - labelDate) < ONE_HOUR * 3) {
              newData[0].data[index++] = data[0].data[i];
              let temp = isoDATE.toString();
              newLineChartLabels.push(temp);
            }
          }
          this.saveChangedRepresentation(desc, newData, newLineChartLabels);

        } else if (res == 'six') {
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

            //only use data from the last 6 hours
            if ((currentDate - labelDate) < ONE_HOUR * 6) {
              newData[0].data[index++] = data[0].data[i];
              let temp = isoDATE.toString();
              newLineChartLabels.push(temp);
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

            //only use data from the last 24 hours
            if ((currentDate - labelDate) < ONE_DAY) {
              newData[0].data[index++] = data[0].data[i];
              let temp = isoDATE.toString();
              newLineChartLabels.push(temp);
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

            //only use data from the last 3 days
            if ((currentDate - labelDate) < ONE_DAY * 3) {
              newData[0].data[index++] = data[0].data[i];
              let temp = isoDATE.toString();
              newLineChartLabels.push(temp);
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
            if ((currentDate - labelDate) < ONE_WEEK) {
              newData[0].data[index++] = data[0].data[i];
              //inline tostring does not work..
              let temp = isoDATE.toString();
              newLineChartLabels.push(temp);
            }
          }
          console.log(newLineChartLabels)
          this.saveChangedRepresentation(desc, newData, newLineChartLabels);

        } else {

        }

      }
    });
    alert.present();
  }

  //update the corresponding data set
  saveChangedRepresentation(desc: string, newData: any, newLineChartLabels: any) {
    console.log(newData);
    if (desc.toLocaleLowerCase() == "luftdruck") {
      this.pressures = newData;
      this.pressureChartLabels = newLineChartLabels;
    } else if (desc.toLocaleLowerCase() == "luftfeuchtigkeit") {
      this.humidities = newData;
      this.humChartLabels = newLineChartLabels;
    } else if (desc.toLocaleLowerCase() == "temperatur") {
      this.temperatures = newData;
      this.tempChartLabels = newLineChartLabels;
    } else if (desc.toLocaleLowerCase() == "helligkeit") {
      this.brightnesses = newData;
      this.brightChartLabels = newLineChartLabels;
    }
  }
}
