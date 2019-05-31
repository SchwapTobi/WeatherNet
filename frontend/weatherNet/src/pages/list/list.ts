import {Component} from '@angular/core';
import {NavController} from 'ionic-angular';
// @ts-ignore
import * as loc from '../../assets/data/locations.json';
import {WeatherRequest} from "../../model/weather/weather";
import {Storage} from "@ionic/storage";
import {CityDetailsPage} from "../city-details/city-details";


@Component({
  selector: 'page-list',
  templateUrl: 'list.html'
})
export class ListPage {

  resultShow: any;
  results: any;
  json: any;
  isANum: boolean;

  constructor(public navCtrl: NavController, private storage: Storage) {
    // load all
    this.json = loc;
    this.resultShow = [];
    this.results = [];
  }

  searchString(event) {
    this.results = [];
    this.resultShow = [];
    let search: string = event.srcElement.value; //the search key

    if (isNaN(Number(search))) {
      this.isANum = false;
      this.filterCityList(search);
    } else if (search.length != 0) {
      this.isANum = true;
      this.filterZipList(Number(search));
    } else {
      this.resultShow = null;
    }
    this.makeResult();
  }

  filterCityList(filtering: string) {
    for (let x in this.json) {
      if (filtering && this.json[x].name && this.json[x].name.toLowerCase().startsWith(filtering.toLowerCase())) {
        this.results.push(this.json[x]);
      }
    }
  }

  filterZipList(filtering: Number) {
    for (let x in this.json) {
      if (this.json[x].name.toLowerCase().startsWith(filtering)) {
        this.results.push(this.json[x]);
      }
    }
  }

  makeResult() {
    if (this.isANum) {
      for (let x in this.results) {
        this.resultShow.push(this.results[x].zipCode + ", " + this.results[x].name);
      }
    } else {
      for (let x in this.results) {
        this.resultShow.push(this.results[x].name + ", " + this.results[x].zipCode);
      }
    }
  }

  itemClick(i) {
    let city = this.results[i];
    let temp = new WeatherRequest(city, this.storage);
    this.navCtrl.push(CityDetailsPage, {
      'city': city
    })
  }

}
