import { ObjectID } from 'mongodb';
export class Vacation {
    _id: ObjectID;
    startDate : Date;
    count : number;
}