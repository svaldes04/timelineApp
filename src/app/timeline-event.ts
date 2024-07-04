export interface TimelineEvent {
    name: string,
    level: string,
    duration: {
        hours: number,
        minutes: number
    },
    children : TimelineEvent[];
  }