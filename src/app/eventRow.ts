export interface IPlatz {
    name: string;
    class: string;
    id?: number;
    typ?: string;
}

export interface IEventRow {
    zeit: string;
    start: Date;
    platz1: IPlatz;
    platz2: IPlatz;
    platz3: IPlatz;
}