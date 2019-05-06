import {Component} from '@angular/core';
import {NavController, NavParams} from 'ionic-angular';
import {LocationSettingsPage} from "../location-settings/location-settings";
import {GeneralSettingsPage} from "../general-settings/general-settings";
import {AboutUsPage} from "../about-us/about-us";
import {LicensesPage} from "../licenses/licenses";

@Component({
  selector: 'page-more',
  templateUrl: 'more.html',
})
export class MorePage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad MorePage');
  }


  //Click events:
  openLocationSettings() {
    this.navCtrl.push(LocationSettingsPage);
  }

  openGeneralSettings() {
    this.navCtrl.push(GeneralSettingsPage);
  }

  openAboutUs() {
    this.navCtrl.push(AboutUsPage);
  }

  openLicences() {
    this.navCtrl.push(LicensesPage);
  }

  openGithub() {
    window.open("https://github.com/SchwapTobi/WeatherNet");
  }

}
