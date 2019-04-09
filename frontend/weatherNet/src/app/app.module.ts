import {ErrorHandler, NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {IonicApp, IonicErrorHandler, IonicModule} from 'ionic-angular';
import {WeatherNetAPP} from './app.component';

import {HomePage} from '../pages/home/home';
import {TabsPage} from '../pages/tabs/tabs';

import {StatusBar} from '@ionic-native/status-bar';
import {SplashScreen} from '@ionic-native/splash-screen';
import {MorePage} from "../pages/more/more";
import {ListPage} from "../pages/list/list";
import {MapPage} from "../pages/map/map";

@NgModule({
  declarations: [
    WeatherNetAPP,
    ListPage,
    MapPage,
    HomePage,
    TabsPage,
    MorePage,
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(WeatherNetAPP)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    WeatherNetAPP,
    ListPage,
    MapPage,
    HomePage,
    TabsPage,
    MorePage,
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {
}
