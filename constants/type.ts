export enum alertType {
    time = 0,
    mock = 1,
    warning = 2
};

export type eventStructure = {
    title: string,
    notes?: string
}

export type rangeTimeType = {
    start: {
        hour: string,
        minutes: string
    },
    end: {
        hour: string,
        minutes: string
    } 
}

export type EventResponse = {
  eventTitle: string;
  response: 1 | 0;
  timestamp: number;
};

export type ProgressData = {
  score: number;        
  toRedeem: number;     
  rewardLabel: string;  
}