import {Component, ElementRef, ViewChild} from '@angular/core';
import { NavController } from 'ionic-angular';

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
      center: new google.maps.LatLng(47.57351, 13.12681),
      zoom: 9,
      mapTypeId: 'terrain',
      disableDefaultUI: true,
      scaleControl: true,
      zoomControl: true,
    }

    this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);
    // this.addMarker(this.map);
  }

  updateMap() {
    this.loadMap();
  }

}

