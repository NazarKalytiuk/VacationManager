import { User } from './user';
import { Vacation } from './vacation';
import { ObjectID } from 'mongodb';
export class Claim {
    _id: ObjectID;
    user: User;
    vacation: Vacation;
}