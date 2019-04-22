import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { HomeDetailsPage } from './home-details';

@NgModule({
  declarations: [
    HomeDetailsPage,
  ],
  imports: [
    IonicPageModule.forChild(HomeDetailsPage),
  ],
})
export class HomeDetailsPageModule {}
