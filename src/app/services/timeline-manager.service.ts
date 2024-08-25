import { Injectable } from '@angular/core';
import { newTimelineEvent, TimelineEvent } from '../interfaces/timeline-event';
import { ItemReorderEventDetail } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class TimelineManagerService {

  timeline: newTimelineEvent[];

  constructor() {
    this.timeline = [];
  
    for (let index = 0; index < 5; index++) {
      this.timeline.push({
        name: `Event ${index}`,
        type: 'event',
        start: new Date(2023, 0, 23 + index, 1, 1),
        end: new Date(2023, 0, 23 + index, 23, 59),
        children: [
          {
            name: `Event ${index}.1`,
            type: 'sub-event',
            start: new Date(2023, 0, 23 + index, 1, 1),
            end: new Date(2023, 0, 23 + index, 1, 1),
            children: []
          },
          {
            name: `Event ${index}.2`,
            type: 'sub-event',
            start: new Date(2023, 0, 23 + index, 20, 5),
            end: new Date(2023, 0, 23 + index, 20, 5),
            children: []
          }
        ]
      });
    }
    
  }

  /**
   * @returns timeline
   */
  getTimeline(){
    return this.timeline
  }

  /**
   * Overwrite the timeline.
   * @param timeline
   * @returns true if timeline is set successfully, false if given timeline is null
   */
  setTimeline(timeline:newTimelineEvent[]){
    if(timeline !== null){
      this.timeline = timeline;
      return true;
    }
    return false;
  }

  /**
   * @param index index of event on the timeline
   * @returns event at index or null if index is out of range
   */
  getEvent(index: number){
    if(index >= 0 && index < this.timeline.length){
      return this.timeline[index];
    } 
    return null;
  }

   /**
   * Overwrite a event from the timeline.
   * @param index index of the event on the timeline
   * @param event new event value
   * @returns true if event is set successfully, false if index is out of range or if given event is null
   */
  setEvent(index: number, event:newTimelineEvent){
    if(event !== null && index >= 0 && index < this.timeline.length){
      this.timeline[index] = event;
      return true;
    } 
    return false;
  }

  /**
   * Overwrite a specific sub-event from an event on the timeline.
   * @param eventIndex index of the event on the timeline
   * @param subEventIndex index of the sub-event on the event's children
   * @param subEvent new sub-event value
   * @returns true if sub-event is set successfully, false if indexes are out of range or if given "subEvent" param is null
   */
  setSubEvent(eventIndex: number, subEventIndex: number, subEvent:newTimelineEvent){
    // check if event is in timeline
    if(eventIndex >= 0 && eventIndex < this.timeline.length){
      // check if subevent is in event children
      if(subEvent !== null && subEventIndex >= 0 && subEventIndex < this.timeline[eventIndex].children.length){
        this.timeline[eventIndex].children[subEventIndex] = subEvent;
        return true;
      }
    }
    return false;
  }

  /**
   * @param eventIndex index of the event on the timeline
   * @param subEventIndex index of the sub-event on the event's children
   * @returns value of specified sub-event, or null if indexes are out of range
   */
  getSubEvent(eventIndex: number, subEventIndex: number){
    // check if event is in timeline
    if(eventIndex >= 0 && eventIndex < this.timeline.length){
      // check if subevent is in event children
      if(subEventIndex >= 0 && subEventIndex < this.timeline[eventIndex].children.length){
        return this.timeline[eventIndex].children[subEventIndex];
      }
    }
    return null;
  }
  
  /**
  * Deletes specified event from the timeline
  * @param index index of event on the timeline
  * @returns true if event is successfully removed from the timeline, or false if not
  */
  deleteEvent(index: number){
    if(index >= 0 && index < this.timeline.length){
      this.timeline.splice(index, 1);
      return true;
    }
    return false;
  }

  /**
  * Deletes specified event from the timeline
  * @param eventIndex index of event on the timeline
  * @returns true if event is successfully removed from the timeline, or false if not
  */
  deleteSubEvent(eventIndex: number, subEventIndex: number){
    if(eventIndex >= 0 && eventIndex < this.timeline.length){
      if(subEventIndex >= 0 && subEventIndex < this.timeline[eventIndex].children.length){
        this.timeline[eventIndex].children.splice(subEventIndex, 1);
        return true;
      }
    }
    return false;
  }

  /**
  * Reorders timeline based on user input through the ion-reorder-group component
  * @param ev event detail emitted by ion-reorder-group
  */
  handleReorder(ev: CustomEvent<ItemReorderEventDetail>) {
    this.timeline = ev.detail.complete(this.timeline);
  }

}
