export interface TimelineEvent {
    name: string,
    type: string,
    duration: {
        hours: number,
        minutes: number
    },
    children: TimelineEvent[];
  }