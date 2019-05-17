import {Component, ElementRef, ViewChild} from '@angular/core';
import {NavController} from 'ionic-angular';
// @ts-ignore
import * as loc from '../../assets/data/locations.json';
import {NetLocation} from "../../model/position/location";
import {Storage} from "@ionic/storage";
import {NodeDetailsPage} from "../node-details/node-details";

declare var google;

@Component({
  selector: 'page-map',
  templateUrl: 'map.html'
})

export class MapPage {

  @ViewChild('map') mapElement: ElementRef;
  map: any;
  CURRENT_LATITUDE: number;
  CURRENT_LONGITUDE: number;

  MAP_RADIUS: number;

  //prerender svg icons
  icons = {
    sunny: {
      path: 'M0,1a1,1 0 1,0 2,0a1,1 0 1,0 -2,0',
      fillColor: 'yellow',
      fillOpacity: 0.8,
      scale: 1,
      strokeColor: 'gold',
      strokeWeight: 14
    }
  };

  constructor(public navCtrl: NavController, private storage: Storage) {
    //define current position to LINZ for testing:
    //TODO: get pos from device

    this.CURRENT_LATITUDE = 48.303055555556;
    this.CURRENT_LONGITUDE = 14.290555555556266;

    //show pins in radius of 25km
    this.MAP_RADIUS = 25;
  }

  ionViewDidLoad() {
    this.loadMap();
  }

  //load google maps, set minimalisitc theme, center map
  loadMap() {
    let mapOptions = {
      center: new google.maps.LatLng(this.CURRENT_LATITUDE, this.CURRENT_LONGITUDE),
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

    this.addLocationMarkers(this.map);
    this.addWeatherNodeMarker(this.map);
  }

  //check if position is in radius
  checkForRadius(lat: number, long: number): boolean {
    let distance = 3958 * Math.PI * Math.sqrt(
      (this.CURRENT_LATITUDE - lat)
      * (this.CURRENT_LATITUDE - lat)
      + Math.cos(this.CURRENT_LATITUDE / 57.29)
      * Math.cos(this.CURRENT_LATITUDE / 57.29) * (this.CURRENT_LONGITUDE - long)
      * (this.CURRENT_LONGITUDE - long)
    ) / 180;
    return distance < this.MAP_RADIUS;
  }

  addLocationMarkers(map: any) {
    let allData = loc;
    let max = allData.length;
    max = 10;

    var i;
    console.log("addMarker called..")
    for (i = 0; i < max; i++) {
      let marker;
      let currLoc: NetLocation = allData[i];

      //add marker only in surrounding area
      if (this.checkForRadius(currLoc.latitude, currLoc.longitude)) {
        marker = new google.maps.Marker({
          position: new google.maps.LatLng(currLoc.latitude, currLoc.longitude),
          map: map,
          icon: 'http://maps.google.com/mapfiles/ms/icons/red.png',
          // icon: this.icons.sunny,
          data: currLoc,
          optimized: true
        });
        this.addMarkerListener(marker, i, this.map);
      } else if (currLoc.zipCode.toString().charAt(3) === '0') {
        console.log("test");
        marker = new google.maps.Marker({
          position: new google.maps.LatLng(currLoc.latitude, currLoc.longitude),
          map: map,
          icon: 'http://maps.google.com/mapfiles/ms/icons/red.png',
          // icon: this.icons.sunny,
          data: currLoc,
          optimized: true
        });
        this.addMarkerListener(marker, i, this.map);
      }
    }
  }

  //add markers to map
  addMarkerListener(marker: any, i: number, map: any) {
    google.maps.event.addListener(marker, 'click', (function (marker, i) {
      var infowindow = new google.maps.InfoWindow();
      return function () {
        var contentString = '<div id="content" style="width: 100%;">' +
          '<h1 id="firstHeading" style="text-align: center">' + marker.data.zipCode + ' ' + marker.data.name + '</h1>' +
          '<div id="bodyContent" style="text-align: center">' +
          '<p style="text-align: center"><a id="' + marker.data.id + '">wetter anzeigen</a></p>' +
          '</div>' +
          '</div>';

        infowindow.setContent(contentString);
        infowindow.open(map, marker);

        var el = document.getElementById(marker.data.id);
        if (el) {
          el.addEventListener('click', () => {
            console.log(marker.data.zipCode)
          });
        }

      }
    })(marker, i));
  }

  //add marker for each weatherNode
  addWeatherNodeMarker(map: any) {

    let weatherNodes;

    //iterate over all nodes
    this.storage.get('weatherNodes').then((val) => {
      weatherNodes = val;

      for (let node of weatherNodes) {
        console.log(node);
        let sensors = "";

        //list features in marker
        for (let sensor of node.measuring) {
          if (sensor) {
            sensors += "-" + sensor + "<br>";
          }
        }

        //clickable ID
        let infowindow = new google.maps.InfoWindow({
          content: "<h2><a id=" + node.nodeID + ">" + node.nodeID + "</a></h2><br>" + sensors
        });

        //define position & radius
        let lat = node.position.latitude;
        let long = node.position.longitude;
        let radius = node.radius;

        let nodeCircle = new google.maps.Circle({
          strokeColor: '#007fff',
          strokeOpacity: 0.8,
          strokeWeight: 3,
          fillColor: '#007fff',
          fillOpacity: 0.2,
          map: map,
          center: new google.maps.LatLng(lat, long),
          radius: radius
        });

        //add listener for click at circle
        google.maps.event.addListener(nodeCircle, 'click', () => {
          infowindow.setPosition(nodeCircle.getCenter());
          infowindow.open(map);
          var el = document.getElementById(node.nodeID);
          if (el) {
            el.addEventListener('click', () => {
              this.showDetails(node)
            });
          }
        });

        infowindow.open(map);
        infowindow.close(map);
        //add listener for click at info field inside circle
        var el = document.getElementById(node.nodeID);
        if (el) {
          el.addEventListener('click', () => {
            this.showDetails(node)
          });
        }

      }
    });
  }

  showDetails(node: string) {
    this.navCtrl.push(NodeDetailsPage, {
      'node': node
    })
  }

  updateMap() {
    this.loadMap();
  }

}

