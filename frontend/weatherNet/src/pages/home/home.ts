import {Component} from '@angular/core';
import {NavController} from 'ionic-angular';
// @ts-ignore
import * as datag from '../../assets/allcities.json';
import {Location} from "../../model/position/location";
import {MorePage} from "../more/more";


@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})

export class HomePage {


  constructor(public navCtrl: NavController) {
    //TODO: get all geolocations
    //this.process();

  }

  private process() {
    let allData = datag.features;
    let allObjects = [];
    let max = 10;

    for (let i = 0; i < max; i++) {
      console.log(allData[i]);
      let obj = new Location(allData[i].zipCode.toString(), allData[i].name.toString());
      allObjects.push(obj);
    }

    console.log(allObjects);
  }

  //show App-infos
  presentPopover() {
    this.navCtrl.push(MorePage);
  }

  //return matching background video
  getVideoByWeatherCondition(){
    //TODO: implement
  }
}
