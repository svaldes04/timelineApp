import { Component, Input } from '@angular/core';
import { TimelineEvent } from '../timeline-event';
import { TabsPage } from '../tabs/tabs.page';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {

  timeline: TimelineEvent[];
  id: string;

  constructor() {
    this.timeline = []
    this.id = "tab1"
  }

}
