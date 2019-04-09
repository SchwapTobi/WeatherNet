import {Component} from '@angular/core';

import {HomePage} from '../home/home';
import {ListPage} from "../list/list";
import {MapPage} from "../map/map";
import {MorePage} from "../more/more";

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {

  tab1Root = MapPage;
  tab2Root = HomePage;
  tab3Root = MorePage;


  constructor() {

  }
}
