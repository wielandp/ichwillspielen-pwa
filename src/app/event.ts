export interface IEvent {
    id: string;
    firstname: string;
    lastname: string;
    telnumber: string;
    body: string;
    typ: string;
    userid: number;
    wert: number;
  }

  export class Event {
    constructor (
      public id: number,
      public start: number,
      public end: number,
      public zeitend: string,
      public firstname: string,
      public lastname: string,
      public telnumber: string,
      public typ: string,
      public userid: number,
      public wert: number,
    ) {}
  }
  