import {ErrorHandler, NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {IonicApp, IonicErrorHandler, IonicModule} from 'ionic-angular';
import {WeatherNetAPP} from './app.component';

import {HomePage} from '../pages/home/home';
import {TabsPage} from '../pages/tabs/tabs';

import {FIREBASE_CONFIG} from "./firebase-config";

import {AngularFireModule} from '@angular/fire';
import {AngularFireDatabase, AngularFireDatabaseModule} from '@angular/fire/database';

import {StatusBar} from '@ionic-native/status-bar';
import {SplashScreen} from '@ionic-native/splash-screen';
import {MorePage} from "../pages/more/more";
import {ListPage} from "../pages/list/list";
import {MapPage} from "../pages/map/map";
import {AboutUsPage} from "../pages/about-us/about-us";
import {GeneralSettingsPage} from "../pages/general-settings/general-settings";
import {HomeDetailsPage} from "../pages/home-details/home-details";
import {LicensesPage} from "../pages/licenses/licenses";
import {LocationSettingsPage} from "../pages/location-settings/location-settings";
import {NodeDetailsPage} from "../pages/node-details/node-details";

import {IonicStorageModule} from "@ionic/storage";
import {ChartsModule} from "ng2-charts-x";
import {WeatherChartPage} from "../pages/weather-chart/weather-chart";


@NgModule({
  declarations: [
    WeatherNetAPP,
    ListPage,
    MapPage,
    HomePage,
    TabsPage,
    MorePage,
    AboutUsPage,
    GeneralSettingsPage,
    HomeDetailsPage,
    LicensesPage,
    LocationSettingsPage,
    NodeDetailsPage,
    WeatherChartPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(WeatherNetAPP),
    IonicStorageModule.forRoot(),
    AngularFireModule.initializeApp(FIREBASE_CONFIG),
    AngularFireDatabaseModule,
    ChartsModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    WeatherNetAPP,
    ListPage,
    MapPage,
    HomePage,
    TabsPage,
    MorePage,
    AboutUsPage,
    GeneralSettingsPage,
    HomeDetailsPage,
    LicensesPage,
    LocationSettingsPage,
    NodeDetailsPage,
    WeatherChartPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    AngularFireDatabase,
    Storage
  ]
})
export class AppModule {
}
