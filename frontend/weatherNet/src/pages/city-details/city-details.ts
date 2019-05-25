import {Component, ElementRef, ViewChild} from '@angular/core';
import {AlertController, ModalController, NavController, NavParams} from 'ionic-angular';
import {BaseChartDirective} from "ng2-charts-x";
import {Storage} from "@ionic/storage";
import {AngularFireDatabase} from '@angular/fire/database';
import {NetLocation} from "../../model/position/location";

declare var google;

@Component({
  selector: 'page-city-details',
  templateUrl: 'city-details.html',
})
export class CityDetailsPage {
  @ViewChild('map') mapElement: ElementRef;
  @ViewChild("baseChart")
  chart: BaseChartDirective;


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

  city: NetLocation;

  map: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, private storage: Storage, private afDatabase: AngularFireDatabase, public modalCtrl: ModalController, public alertCtrl: AlertController) {
    this.city = this.navParams.get('city');

  }


  ionViewDidLoad() {
    this.loadMap();
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
}
