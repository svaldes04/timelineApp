export interface TimelineEvent {
    name: string,
    type: string,
    duration: {
        hours: number,
        minutes: number
    },
    children: TimelineEvent[];
  }

export interface newTimelineEvent{
    name: string,
    type: string,
    start: Date,
    end: Date,
    children: newTimelineEvent[],
}