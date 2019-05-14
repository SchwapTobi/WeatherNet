import {Component, ElementRef, ViewChild} from '@angular/core';
import {NavController, NavParams} from 'ionic-angular';
import {Storage} from "@ionic/storage";
import {AngularFireDatabase} from '@angular/fire/database';
import {BaseChartDirective} from "ng2-charts-x";

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

  constructor(public navCtrl: NavController, public navParams: NavParams, private storage: Storage, private afDatabase: AngularFireDatabase) {
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
      console.log(res);
      this.processLogs();
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
      lables.push(item.timestamp.toString().substring(0, 9) + " " + item.timestamp.toString().substring(11, 16));
      temps.push(item.temperature);
      humidities.push(item.humidity.toString().replace('%', ''));
      brightnesses.push(item.brightness);
      pressures.push(item.pressure);

    }

    this.lineChartLabels = lables;
    this.temperatures[0].data = (temps);
    this.humidities[0].data = (humidities);
    this.brightnesses[0].data = (brightnesses);
    this.pressures[0].data = (pressures);

  }
}
