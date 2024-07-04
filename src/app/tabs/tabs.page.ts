import { Component, ViewChild } from '@angular/core';
import { TimelineEvent } from '../timeline-event';
import { Tab1Page } from '../tab1/tab1.page';
import { Tab2Page } from '../tab2/tab2.page';
import { IonTabs } from '@ionic/angular';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss']
})
export class TabsPage {

  @ViewChild('myTabs') tabs: IonTabs | undefined;

  static timeline: TimelineEvent[];

  constructor() {
    // Test data
    TabsPage.timeline = [];
  }

  saveChanges(){
    var currentTab = this.tabs.outlet.activatedComponentRef?.instance;
    if(currentTab.id === "tab1"){
      currentTab.timeline = TabsPage.timeline;
    }
    console.log(currentTab, currentTab.timeline);
    // i think we've done it. i can get the tab instance reference

    }
  }
