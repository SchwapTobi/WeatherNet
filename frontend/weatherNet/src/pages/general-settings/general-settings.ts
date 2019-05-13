import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams} from 'ionic-angular';

@Component({
  selector: 'page-general-settings',
  templateUrl: 'general-settings.html',
})
export class GeneralSettingsPage {

  public settingOne: boolean;
  public settingTwo: boolean;
  public settingThree: boolean;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad GeneralSettingsPage');
  }

  notifyOne() {
    console.log("SEtting One" + this.settingOne);
  }

  notifyTwo() {
    console.log("SEtting two" + this.settingTwo);
  }

  notifyThree() {
    console.log("SEtting three" + this.settingThree);
  }

  contactClick() {
    console.log("Contact clicked");
  }

  feedbackClick() {
    console.log("Feedback clicked");
  }

}
