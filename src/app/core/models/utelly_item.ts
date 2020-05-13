import { Streamers } from './streamers';

export interface Utelly_Item{
    id:string,
    picture:string,
    name:string,
    locations:Streamers[],
    provider:string,
    weight:number
}