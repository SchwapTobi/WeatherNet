import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { NodeDetailsPage } from './node-details';

@NgModule({
  declarations: [
    NodeDetailsPage,
  ],
  imports: [
    IonicPageModule.forChild(NodeDetailsPage),
  ],
})
export class NodeDetailsPageModule {}
