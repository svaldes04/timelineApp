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
  startdate: Date;

  // Constructor function
  constructor() {
    this.timeline = [];
    this.counter = 0;
    // TabsPage.timeline = this.timeline;
    this.isModalOpen = false;
    this.isSubModalOpen = false;
    this.selectedEvent = -1;
    this.selectedSubEvent = -1;
    this.startdate = new Date();
  }

  // Add a new event to timeline
  addToTimeline(){
    this.counter+=1;

    let newEvent: TimelineEvent = {
      name: `Event ${this.counter}`,
      type: 'event',
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

    let newEvent: TimelineEvent = {
      name: `Event ${this.counter}`,
      type: 'sub-event',
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

    // if last sub-event of selected event's children is spacer, remove it
    if(this.timeline[this.selectedEvent].children[this.timeline[this.selectedEvent].children.length-1].type === "spacer"){
      this.timeline[this.selectedEvent].children.pop();
    }

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
    // Check if there's negative values on input
    if(this.hoursInput.value as number < 0 || this.minutesInput.value as number < 0){
      alert("A negative value is being input. Please the values for hours and minutes");
      return;
    }

    // Store user input in a duration object 
    let eventDuration = {
      hours: Math.floor(this.hoursInput.value as number),
      minutes: Math.floor(this.minutesInput.value as number)
    };

    // Appropiate time format
    eventDuration = this.cleanDuration(eventDuration);

    // Add duration of child events and store in this variable
    let childrenDuration = { hours: 0, minutes: 0 };
    for(let i = 0; i < this.timeline[this.selectedEvent].children.length; i++){
      childrenDuration.hours += this.timeline[this.selectedEvent].children[i].duration.hours;
      childrenDuration.minutes += this.timeline[this.selectedEvent].children[i].duration.minutes;
    }

    // check if sum of child event durations is greater/lesser/equal to parent event duration
    let minDifference = this.compareDurations( eventDuration, childrenDuration);

    if(minDifference < 0){

      alert("Sum of sub-events take more time than the parent event. Please change the duration of event or sub-events.");

    } else {
      // Add a wait event until the end of parent event
      if(minDifference > 0 && this.timeline[this.selectedEvent].children.length > 0){
        
        // Create wait event for remaining time
        let waitEvent: TimelineEvent = {
          name: ` Spacer `,
          type: 'spacer',
          duration: this.cleanDuration({hours: 0, minutes: +minDifference}),
          children: []
        };
        this.timeline[this.selectedEvent].children.push(waitEvent);

      }
      // Save changes
      this.timeline[this.selectedEvent].name = this.nameInput.value as string;
      this.timeline[this.selectedEvent].duration = eventDuration;
      this.closeModal();
      this.timelineEditor.closeOpened();
    }

  }

  submitSubChanges(){

    // Check if there's negative values on input
    if(this.hoursInputSub.value as number < 0 || this.minutesInputSub.value as number < 0){
      alert("A negative value is being input. Please the values for hours and minutes");
      return;
    }

    // Store user input in a duration object 
    let subeventDuration = {
      hours: Math.floor(this.hoursInputSub.value as number),
      minutes: Math.floor(this.minutesInputSub.value as number)
    };

    // Appropiate time format
    subeventDuration = this.cleanDuration(subeventDuration);

    // Save changes
    this.timeline[this.selectedEvent].children[this.selectedSubEvent].name = this.nameInputSub.value as string;
    this.timeline[this.selectedEvent].children[this.selectedSubEvent].duration = subeventDuration;
    this.closeSubModal();
    this.timelineEditorSub.closeOpened();
  }

  // Saves start date with correct time zone in TabsPage
  updateDate(){
    const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const rawDate = new Date(
      parseInt((this.dateMain.value as string).substring(0,4)),       // year
      parseInt((this.dateMain.value as string).substring(5,7)) - 1,   // month
      parseInt((this.dateMain.value as string).substring(8,10)),      // day
      parseInt((this.dateMain.value as string).substring(11,13)),     // hour
      parseInt((this.dateMain.value as string).substring(14,16))      // minute
        );
    const zonedDate = utcToZonedTime(rawDate, userTimeZone);
    this.startdate = zonedDate;
    //console.log(formatISO(zonedDate));
  }

  // Given a duration, will return duration for the same amount of time ensuring all 'extra' minutes are turned into hours
  cleanDuration(duration: {hours:number, minutes:number}){
    let addHours = Math.floor(duration.minutes / 60);
    let subMinutes = addHours*60;
    let result = {
      hours: +duration.hours + +addHours,
      minutes: +duration.minutes - +subMinutes
    };
    return result;
  }

  // Returns a positive value if d1 represents more time than d2. Returns a negative value if d1 represents less time than d2. Returns 0 if d1 and d2 represent the same time.
  // This function works even if durations are not clean.
  compareDurations(d1: {hours:number, minutes:number}, d2: {hours:number, minutes:number}){
    let minutesD1 = d1.minutes + (d1.hours*60);
    let minutesD2 = d2.minutes + (d2.hours*60);

    return +minutesD1 - +minutesD2;
  }

  // Returns given date plus given duration. Duration doesnt need to be clean
  datePlusDuration(date:Date, duration:{hours:number, minutes:number}){
    let durationMinutes = +duration.minutes + (+duration.hours*60);
    return new Date(date.getTime() + durationMinutes*60000);
  }

  // Returns number of child events excluding end spacers
  getTrueChildNum(event: TimelineEvent){
    let result = 0;
    for(let i = 0; i < event.children.length; i++){
      if(event.children[i].type ==="sub-event"){
        result++;
      }
    }
    return result;
  }

  timelineToEventList(){
    let result = [];
    for(let i = 0; i < this.timeline.length; i++){
      result.push(this.timeline[i]);

      for(let j = 0; j < this.timeline[i].children.length; j++){
        result.push(this.timeline[i].children[j]);
      }
    }
    console.log(result);
  }

  loadNewTimeline(){
    let newTimeline = [];
    for(let i = 0; i < this.timeline.length; i++){
      newTimeline.push(this.timeline[i]);

      for(let j = 0; j < this.timeline[i].children.length; j++){
        newTimeline.push(this.timeline[i].children[j]);
      }
    }
    console.log(newTimeline);
    TabsPage.timeline = newTimeline;

    let timelineDates = [];
    let lastSubMin = 0;
    for(let i = 0; i < this.timeline.length; i++){
      if( i === 0 ){
        timelineDates.push(this.startdate);
      } else if( lastSubMin > 0){
        timelineDates.push(this.datePlusDuration(timelineDates[timelineDates.length - 1], {hours: 0, minutes: lastSubMin}));
        lastSubMin = 0;
      } else {
        // Adds the time when previous event will end as start time for this event
        timelineDates.push(this.datePlusDuration(timelineDates[timelineDates.length - 1], this.timeline[i - 1].duration));
      }

      // Similar logic for adding sub events to timelineDates
      for(let j = 0; j < this.timeline[i].children.length; j++){
        if( j === 0) {
          timelineDates.push(new Date (timelineDates[timelineDates.length - 1].getTime()));
        } else {
          timelineDates.push(this.datePlusDuration(timelineDates[timelineDates.length - 1], this.timeline[i].children[j - 1].duration));
          if( j === (this.timeline[i].children.length - 1)){
            lastSubMin = this.timeline[i].children[j].duration.minutes + (this.timeline[i].children[j].duration.hours*60)
          }
        }
      }
    }
    console.log(timelineDates);
    TabsPage.startdates = timelineDates;
  }

  // TODO change start date for sub-events (take parent start date)
  calculateExpectedStart(timeline: TimelineEvent[], index: number){
    let result = this.startdate;
    for(let i = 0; i < index; i++){
      result = this.datePlusDuration(result, timeline[i].duration);
    }
    return result;
  }

}