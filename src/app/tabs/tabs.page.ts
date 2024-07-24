import { Component, ViewChild } from '@angular/core';
import { TimelineEvent } from '../timeline-event';
import { IonTabs } from '@ionic/angular';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss']
})
export class TabsPage {

  @ViewChild('myTabs') tabs: IonTabs;

  static timeline: TimelineEvent[];
  static startdates: Date[];

  constructor() {
    TabsPage.timeline = [];
    TabsPage.startdates = [];
  }

  // Saves timeline changes to tab1 when user switches tabs to tab1
  saveChanges(){
    var currentTab = this.tabs.outlet.activatedComponentRef?.instance;
    if(currentTab.id === "tab1"){
      currentTab.timeline = TabsPage.timeline;
      currentTab.startdates = TabsPage.startdates;
    }
    // console.log(currentTab, currentTab.timeline);
  }
}
