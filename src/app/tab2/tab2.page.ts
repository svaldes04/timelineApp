import { Component, ViewChild } from '@angular/core';
import { IonDatetime, IonInput, IonItemSliding, ItemReorderEventDetail } from '@ionic/angular';
import { TimelineEvent } from '../timeline-event';
import { TabsPage } from '../tabs/tabs.page';
import { utcToZonedTime } from 'date-fns-tz';
import { formatISO } from 'date-fns';


@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page {

  @ViewChild('nameInput') nameInput: IonInput;
  @ViewChild('hoursInput') hoursInput: IonInput;
  @ViewChild('minutesInput') minutesInput: IonInput;
  @ViewChild('timelineEditor') timelineEditor: IonItemSliding;

  @ViewChild('nameInputSub') nameInputSub: IonInput;
  @ViewChild('hoursInputSub') hoursInputSub: IonInput;
  @ViewChild('minutesInputSub') minutesInputSub: IonInput;
  @ViewChild('timelineEditorSub') timelineEditorSub: IonItemSliding;

  @ViewChild('dateMain') dateMain: IonDatetime;

  timeline: TimelineEvent[];
  counter: number;
  isModalOpen: boolean;
  isSubModalOpen: boolean;
  selectedEvent: number;
  selectedSubEvent: number;

  // Constructor function
  constructor() {
    // Data for easy testing --> Usually empty list
    this.timeline = [];
    this.counter = 0;
    TabsPage.timeline = this.timeline;
    this.isModalOpen = false;
    this.isSubModalOpen = false;
    this.selectedEvent = -1;
    this.selectedSubEvent = -1;
  }

  // Add a new event to timeline
  addToTimeline(){
    this.counter+=1;

    var newEvent: TimelineEvent = {
      name: `Event ${this.counter}`,
      level: 'main',
      duration: {
        hours: 1,
        minutes: 0
      },
      children: []
    };
    this.timeline.push(newEvent);
    
  }

  // Add sub event to an event
  addChildEvent(){
    this.counter+=1;

    var newEvent: TimelineEvent = {
      name: `Event ${this.counter}`,
      level: 'sub',
      duration: {
        hours: 0,
        minutes: 0
      },
      children: []
    };
    this.timeline[this.selectedEvent].children.push(newEvent);
    
  }


  // Delete an event from timeline
  deleteEvent(index: number){
    this.timeline.splice(index, 1);
    this.timelineEditor.closeOpened();
  }

  // Delete a child from evemt
  deleteSubEvent(index: number){
    this.timeline[this.selectedEvent].children.splice(index, 1);
    this.timelineEditorSub.closeOpened();
  }

  // Handle reordering of event's children
  handleReorderSub(ev: CustomEvent<ItemReorderEventDetail>){
    this.timeline[this.selectedEvent].children = ev.detail.complete(this.timeline[this.selectedEvent].children)
  }

  changeDateState(dateObj: IonDatetime){
    dateObj.disabled = !dateObj.disabled;
  }

  // Handle reordering of timeline
  handleReorder(ev: CustomEvent<ItemReorderEventDetail>) {
    this.timeline = ev.detail.complete(this.timeline);
  }

  // close main modal
  closeModal(){
    this.isModalOpen = false;
  }

  // open main modal with chosen event
  openModal(state: boolean, index: number){
    this.selectedEvent = index;
    this.isModalOpen = true;
  }

  // close sub modal
  closeSubModal(){
    this.isSubModalOpen = false;
  }

  // open sub modal with chosen sub-event
  openSubModal(state: boolean, index: number){
    this.selectedSubEvent = index;
    this.isSubModalOpen = true;
  }

  submitChanges(){
    this.dateMain.confirm();
    // if minutes is not between 0-59
    if(this.minutesInput.value as number > 59 || this.minutesInput.value as number < 0){
      this.minutesInput.value = 0;
      alert("Please select a valid value for minutes.");
    // if hours is lower than 0
    } else if(this.hoursInput.value as number < 0){
      this.hoursInput.value = 0;
      alert("Please select a valid value for hours.");
    } else {
      this.timeline[this.selectedEvent].name = this.nameInput.value as string;
      this.timeline[this.selectedEvent].duration.hours = this.hoursInput.value as number;
      this.timeline[this.selectedEvent].duration.minutes = this.minutesInput.value as number;
      /*
      // If date picker is enabled, save date in correct time zone. Else, undefined.
      if(!this.dateMain.disabled){
        const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
        const rawDate = new Date(
          parseInt((this.dateMain.value as string).substring(0,4)),     // year
          parseInt((this.dateMain.value as string).substring(5,7)) - 1, // month
          parseInt((this.dateMain.value as string).substring(8,10)),     // day
          parseInt((this.dateMain.value as string).substring(11,13)),     // hour
          parseInt((this.dateMain.value as string).substring(14,16))      // minute
          );
        const zonedDate = utcToZonedTime(rawDate, userTimeZone);
        console.log(rawDate);
        console.log(userTimeZone);
        console.log(zonedDate);
        console.log(formatISO(zonedDate));
        this.timeline[this.selectedEvent].startDate = formatISO(zonedDate);

      } else {
        this.timeline[this.selectedEvent].startDate = undefined;
      }
      */
      this.closeModal();
      this.timelineEditor.closeOpened();
    }

  }

  submitSubChanges(){
    // if minutes is not between 0-59
    if(this.minutesInputSub.value as number > 59 || this.minutesInputSub.value as number < 0){
      this.minutesInputSub.value = 0;
      alert("Please select a valid value for minutes");
    // if hours is lower than 0
    } else if(this.hoursInputSub.value as number < 0){
      this.hoursInputSub.value = 0;
      alert("Please select a valid value for hours");
    } else {
      this.timeline[this.selectedEvent].children[this.selectedSubEvent].name = this.nameInputSub.value as string;
      this.timeline[this.selectedEvent].children[this.selectedSubEvent].duration.hours = this.hoursInputSub.value as number;
      this.timeline[this.selectedEvent].children[this.selectedSubEvent].duration.minutes = this.minutesInputSub.value as number;
      this.closeSubModal();
      this.timelineEditorSub.closeOpened();
    }

  }

}