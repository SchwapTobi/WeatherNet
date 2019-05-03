import {Component} from '@angular/core';
import {NavController} from 'ionic-angular';
// @ts-ignore
import * as datag from '../../assets/allcities.json';
import {Location} from "../../model/position/location";


@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})

export class HomePage {


  constructor(public navCtrl: NavController) {
    this.process();

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
}
