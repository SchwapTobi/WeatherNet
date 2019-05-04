import {Component} from '@angular/core';
import {NavController} from 'ionic-angular';
// @ts-ignore
import * as datag from '../../assets/selectedCities.json';

import {Location} from "../../model/position/location";
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

  download() {
    this.exportJson(JSON.stringify(this.allObjects));
  }

  exportJson(data) {
    let filename = 'locations.json'
    var blob = new Blob([data], {type: 'text/plain'}),
      e = document.createEvent('MouseEvents'),
      a = document.createElement('a')
    if (window.navigator && window.navigator.msSaveOrOpenBlob) {
      window.navigator.msSaveOrOpenBlob(blob, filename);
    }
    else {
      e = document.createEvent('MouseEvents'),
        a = document.createElement('a');
      a.download = filename;
      a.href = window.URL.createObjectURL(blob);
      a.dataset.downloadurl = ['text/plain', a.download, a.href].join(':');
      e.initEvent('click', true, false);
      a.dispatchEvent(e);
    }
  }

  //show App-infos
  presentPopover() {
    this.navCtrl.push(MorePage);
  }

  //return matching background video
  getVideoByWeatherCondition() {
    //TODO: implement
  }

  async timer(ms) {
    return new Promise(res => setTimeout(res, ms));
  }

  process() {
    let allData = datag.features;
    let max = 3;
    var _this = this;

    function delayedLoop(index, iterableArray) {
      if (index >= 1000) {
        alert("DONE!")
        return;
      }
      let obj = new Location(allData[index].zipCode.toString(), allData[index].name.toString());
      console.log(obj);
      _this.allObjects.push(obj);
      console.log(_this.allObjects);
      index += 1;
      setTimeout(delayedLoop.bind({}, index, iterableArray), 1000);
    }

    delayedLoop(0, allData);

    // for (let i = 0; i < max; i++) {
    //   let obj = new Location(allData[i].zipCode.toString(), allData[i].name.toString());
    //   console.log(obj);
    //   this.allObjects.push(obj);
    // }
    console.log(this.allObjects);
  }


}
