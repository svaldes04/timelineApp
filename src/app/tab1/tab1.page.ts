import { Component, Input, ViewChild } from '@angular/core';
import { TimelineEvent } from '../interfaces/timeline-event';
import { IonToggle } from '@ionic/angular';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {

  @ViewChild('uiToggle') uiToggle: IonToggle;
  timeline: TimelineEvent[];
  startdates: Date[];
  id: string;
  legacyUI = true;

  constructor() {
    this.timeline = []
    this.id = "tab1"
    this.startdates = [];
  }

   // Returns given date plus given duration. Duration doesnt need to be clean
  datePlusDuration(date:Date, duration:{hours:number, minutes:number}){
    let durationMinutes = +duration.minutes + (+duration.hours*60);
    return new Date(date.getTime() + durationMinutes*60000);
  }

  // Given the index of an event from the timeline, returns the index of previous parent event. Or 0 if there are no previous parent events
  prevParentStartdate(index: number){
    for(let i = (index - 1); i >= 0; i--){
      if(this.timeline[i].type === "event"){
        return i;
      }
    }
    return 0;
  }
  toggleUI(){
    this.legacyUI = this.uiToggle.checked;
  }


}
