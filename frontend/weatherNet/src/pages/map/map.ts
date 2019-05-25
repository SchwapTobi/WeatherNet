import {Component, ElementRef, ViewChild} from '@angular/core';
import {NavController} from 'ionic-angular';
import {NetLocation} from "../../model/position/location";
import {Storage} from "@ionic/storage";
import {NodeDetailsPage} from "../node-details/node-details";
// @ts-ignore
import * as loc from '../../assets/data/locations.json';
// @ts-ignore
import * as CAPITALS from '../../assets/data/capitals.json';
import {WeatherUTIL} from "../../model/weather/weatherUTIL";
import {CityDetailsPage} from "../city-details/city-details";

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
    this.addCapitalWeatherMarker(this.map);
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
    max = 0;

    var i;
    // console.log("addMarker called..")
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
        // console.log("test");
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
            // console.log(marker.data.zipCode)
          });
        }

      }
    })(marker, i));
  }

  //add markers to map
  addCityMarkerListener(marker: any, map: any) {
    var _this = this;
    marker.addListener('click', function () {
      _this.showCityDetails(marker.data);
    });
  }

  //add marker for each weatherNode
  addWeatherNodeMarker(map: any) {
    let weatherNode;
    //iterate over all nodes
    this.storage.get('weatherNodes').then((val) => {
      weatherNode = val;

      console.log(weatherNode);

      for (let node of weatherNode) {
        // console.log(node);
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

  //add marker for each weatherNode
  addCapitalWeatherMarker(map: any) {
    let capitals = CAPITALS;
    //iterate over all capitals & load weather from localstorage
    for (let city of capitals) {
      let key = "currentWeatherIn" + city.name;
      let data = this.storage.get(key).then(data => {
        console.log(data);
        let maxTemp: string = WeatherUTIL.getColorFromTemp(data.main.temp_max);

        // let maxTemp:string = "#ffa500";
        let label = data.main.temp_max.toString().split(".")[0];

        //define svg icon
        let rawSVG = '<svg width="20" height="20" xmlns="http://www.w3.org/2000/svg">\n' +
          ' <g>\n' +
          '  <ellipse ry="10" rx="10" id="svg_1" cy="10" cx="10" fill-opacity="null" stroke-opacity="null" stroke-width="null"  fill="#424242"/>\n' +
          '  <ellipse ry="9" rx="9" id="svg_3" cy="10" cx="10" stroke-opacity="null" stroke-width="null" fill="{MAX}"/>\n' +
          ' </g>\n' +
          '</svg>';

        //set color from current temperature
        let svg = rawSVG.replace('{MAX}', maxTemp);

        let infowindow = new google.maps.InfoWindow({
          content: "<h2><a id=" + city.id + ">" + city.zipcode + " " + city.name + "</a></h2><br>"
        });

        let marker = new google.maps.Marker({
          position: new google.maps.LatLng(city.latitude, city.longitude),
          map: map,
          icon: {
            url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(svg),
            scaledSize: new google.maps.Size(40, 40)
          },
          label: {
            text: "" + label,
            color: 'black',
            fontSize: '17px',
            fontWeight: 'bold'
          },
          data: city,
          center: new google.maps.LatLng(city.latitude, city.longitude),
          optimized: true
        });
        this.addCityMarkerListener(marker, this.map);
      });
    }
  }

  showDetails(node: string) {
    this.navCtrl.push(NodeDetailsPage, {
      'node': node
    })
  }

  showCityDetails(city: NetLocation) {
    this.navCtrl.push(CityDetailsPage, {
      'city': city
    })
  }

  updateMap() {
    this.loadMap();
  }

}

