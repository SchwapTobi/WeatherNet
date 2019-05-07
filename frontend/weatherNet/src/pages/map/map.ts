import {Component, ElementRef, ViewChild} from '@angular/core';
import {NavController} from 'ionic-angular';

declare var google;


@Component({
  selector: 'page-map',
  templateUrl: 'map.html'
})

export class MapPage {

  @ViewChild('map') mapElement: ElementRef;
  map: any;

  constructor(public navCtrl: NavController) {
  }

  ionViewDidLoad() {
    this.loadMap();
  }

  loadMap() {
    let mapOptions = {
      center: new google.maps.LatLng(48.303055555556, 14.290555555556266),
      zoom: 14,
      mapTypeId: 'roadmap',
      disableDefaultUI: true,
      scaleControl: true,
      zoomControl: true,
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
          "featureType": "administrative.land_parcel",
          "elementType": "labels",
          "stylers": [
            {
              "visibility": "off"
            }
          ]
        },
        {
          "featureType": "poi",
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
        },
        {
          "featureType": "transit",
          "stylers": [
            {
              "visibility": "off"
            }
          ]
        }
      ]
    }


    this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);

    var image = 'https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png';

    this.addWeatherNodeMarker(this.map);
    // this.addMarker(this.map);
  }

  addWeatherNodeMarker(map: any) {



    var infowindow = new google.maps.InfoWindow({
      content: "<h2>ID</h2>"
    });

    var nodeCircle = new google.maps.Circle({
      strokeColor: '#007fff',
      strokeOpacity: 0.8,
      strokeWeight: 3,
      fillColor: '#007fff',
      fillOpacity: 0.2,
      map: map,
      center: new google.maps.LatLng(48.303055555556, 14.290555555556266),
      radius: 1500
    });

    google.maps.event.addListener(nodeCircle, 'click', function(ev){
      infowindow.setPosition(nodeCircle.getCenter());
      infowindow.open(map);
    });
  }

  updateMap() {
    this.loadMap();
  }

}

