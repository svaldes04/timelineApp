import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IonDatetime, IonInput, ItemReorderEventDetail } from '@ionic/angular';
import { TimelineManagerService } from '../services/timeline-manager.service';
import { newTimelineEvent } from '../interfaces/timeline-event';
import { utcToZonedTime } from 'date-fns-tz';

@Component({
  selector: 'app-event',
  templateUrl: './event.page.html',
  styleUrls: ['./event.page.scss'],
})
export class EventPage implements OnInit {

  @ViewChild('nameInput') nameInput: IonInput;
  @ViewChild('startInput') startInput: IonDatetime;
  @ViewChild('endInput') endInput: IonDatetime;

  eventIndex: number;
  subEventIndex: number;
  displayEventValue: newTimelineEvent;

  previousEventValue: newTimelineEvent;
  nextEventValue: newTimelineEvent;

  isAlertOpen = false;

  constructor(private route: ActivatedRoute,
    private router: Router, private timelineManager: TimelineManagerService) { }

  ngOnInit() {
    // check id of route. if invalid, redirect to correct route
    let id = this.route.snapshot.paramMap.get('id');
    let indexes = id.split("-");
    this.eventIndex = parseInt(indexes[0]);
    if(indexes.length > 1){
      this.subEventIndex = parseInt(indexes[1]);
    }
    if(this.timelineManager.getEvent(this.eventIndex) === null){
      this.router.navigate(['/tabs/tab2']);
    } else if(this.timelineManager.getSubEvent(this.eventIndex, this.subEventIndex) === null && indexes.length > 0){
      this.router.navigate([`/event/${this.eventIndex}`]);
    }
    // get page's event
    this.displayEventValue = (indexes.length > 1) ? (this.timelineManager.getSubEvent(this.eventIndex, this.subEventIndex)) : (this.timelineManager.getEvent(this.eventIndex));
    // get previous and next event
    this.previousEventValue = this.getPreviousEvent();
    this.nextEventValue = this.getNextEvent();
  }

  openSubEvent(subEventIndex: any){
    if(this.saveChanges()){
      this.router.navigate([`/event/${this.eventIndex}-${subEventIndex}`]);
    }
  }

  saveChanges(){
    // TODO display minimum and maximum dates on UI page and limit via an if statement here
    if(this.displayEventValue.start.getTime() > this.displayEventValue.end.getTime()){
      this.isAlertOpen = true;
      return false;
    }
    let updatedEvent: newTimelineEvent = {
      name: this.nameInput.value as string,
      type: this.displayEventValue.type, 
      start: this.displayEventValue.start, 
      end: this.displayEventValue.end, 
      children: this.displayEventValue.children,
    };
    if(this.subEventIndex !== undefined){
      this.timelineManager.setSubEvent(this.eventIndex, this.subEventIndex, updatedEvent);
    } else {
      this.timelineManager.setEvent(this.eventIndex, updatedEvent);
    }
    return true;
  }

  submitChanges(){
    let save_result = this.saveChanges();
    if(save_result){
      if(this.subEventIndex !== undefined){
        this.router.navigate([`/event/${this.eventIndex}`]);
      } else {
        this.router.navigate([`/tabs/tab2`]);
      }
    }
  }

  getRouteId(){
    return this.route.snapshot.paramMap.get('id');
  }

  placeholder(){
    console.log("method called");
  }

  dateToString(date: Date){
    // console.log(date.toISOString().slice(0,16) + " -> GMT+0");
    let result = "";
    let year = date.getFullYear().toString();
    let month = (date.getMonth() + 1).toString();
    month = (month.length === 1) ? '0'+ month : month;
    let day = date.getDate().toString();
    day = (day.length === 1) ? '0'+ day : day;
    let hour = date.getHours().toString();
    hour = (hour.length === 1) ? '0'+ hour : hour;
    let minute = date.getMinutes().toString();
    minute = (minute.length === 1) ? '0'+ minute : minute;

    result = year + "-" + month + "-" + day + "T" + hour + ":" + minute;
    return result;
    // console.log(result + " -> Local time");
  }

  stringToDate(date: string){
    const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const rawDate = new Date(
      parseInt(date.substring(0,4)),       // year
      parseInt(date.substring(5,7)) - 1,   // month
      parseInt(date.substring(8,10)),      // day
      parseInt(date.substring(11,13)),     // hour
      parseInt(date.substring(14,16))      // minute
        );
    const zonedDate = utcToZonedTime(rawDate, userTimeZone);
    return zonedDate;
  }

  getPreviousEvent(){
    let previousEvent: newTimelineEvent;
    if(this.displayEventValue.type === 'sub-event'){
      // previous sub event
      previousEvent = this.timelineManager.getSubEvent(this.eventIndex, this.subEventIndex - 1);
      if(previousEvent === null){
        // start of this event's parent
        previousEvent = this.timelineManager.getEvent(this.eventIndex);
      }
    } else {
      // previous event
      previousEvent = this.timelineManager.getEvent(this.eventIndex - 1);
    }
    return previousEvent;
  }

  getNextEvent(){
    let nextEvent: newTimelineEvent;
    if(this.displayEventValue.type === 'sub-event'){
      // next sub event
      nextEvent = this.timelineManager.getSubEvent(this.eventIndex, this.subEventIndex + 1);
      if(nextEvent === null){
        // end of this event's parent
        nextEvent = this.timelineManager.getEvent(this.eventIndex);
      }
    } else {
      // next event
      nextEvent = this.timelineManager.getEvent(this.eventIndex + 1);
    }
    return nextEvent;
  }

  // Handle reordering of timeline
  handleReorder(ev: CustomEvent<ItemReorderEventDetail>) {
    this.displayEventValue.children = ev.detail.complete(this.displayEventValue.children);
    // handle change in times from reorder
    this.saveChanges();
  }

  addSubEvent(){
    // save current state
    // add
    // save
  }

  deleteSubEvent(){
    // save current state
    // delete
    // save
  }

  startChange(event: any){
    this.displayEventValue.start = this.stringToDate(event.detail.value);
  }
  endChange(event: any){
    this.displayEventValue.end = this.stringToDate(event.detail.value);
  }

}
