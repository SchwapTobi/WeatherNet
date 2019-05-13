import {Component} from '@angular/core';
import {App, NavController} from 'ionic-angular';

import {MorePage} from "../more/more";


@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})

export class HomePage {
  allObjects = [];

  constructor(public navCtrl: NavController) {
    //test with Linz Area
    // this.process();

  }

  //show App-infos
  presentPopover() {
    this.navCtrl.push(MorePage);
  }

  //return matching background video
  getVideoByWeatherCondition() {
    //TODO: implement
  }
}
