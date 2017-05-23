import { ObjectID } from 'mongodb';
import { Vacation } from './vacation';
import { Claim } from './claim';
import { Role } from './role';

export class User {
    _id: ObjectID;
    name: string;
    email: string;
    googleId: string;
    vacations : Array<Vacation>;
    claims: Array<Claim>;
    role: Role;
    accessToken: string;
    imageUrl: string;
}