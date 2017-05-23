import { Repository } from "../contracts/repository";
import { Claim } from '../../../models/claim';
import { ApplicationDbContext } from '../../applicationDbContext';
import { Db, ObjectID } from 'mongodb';

export class ClaimRepository implements Repository<Claim> {

    constructor() {
        this.db = ApplicationDbContext.getApplicationDbContext().db;
    }
    private db: Db;
    async get(id?: any): Promise<any | Claim> | Promise<any> { //can`t write Promise<Claim> or cast
        if (id) {
            return this.db.collection('Claims').findOne({ _id: new ObjectID(id) });
        }
        return this.db.collection('Claims').find().toArray();
    }
    async add(item: Claim): Promise<any> {
        return this.db.collection('Claims').insert(item);
    }
    async update(item: Claim): Promise<any> {
        return this.db.collection('Claims').updateOne({ _id: new ObjectID(item._id) }, item);
    }
    async delete(item: Claim): Promise<any> {
        return this.db.collection('Claims').deleteOne({ _id: new ObjectID(item._id) }, item);
    }
}