import * as express from 'Express';
import { Request, Response } from 'express'
import * as passport from 'passport';
import { Db, ObjectID } from 'mongodb';

import { User, Claim } from "../models";
import { passportConfig } from "../config";
import { ClaimRepository, ApplicationDbContext } from '../domain'

export class UserController {
    private db: Db;
    private claimRepository: ClaimRepository
    constructor(app: express.Application) {
        this.db = ApplicationDbContext.getApplicationDbContext().db;
        this.claimRepository = new ClaimRepository();


        app.get('/user/claims', this.getUserClaims);
    };
    private get getUserClaims() {
        return async (req: Request, res: Response) => {
            let user = req.user;
            let claims = await this.db.collection('Claims').find({ 'user.name': user.name }).toArray();
            // let claims : Array<Claim> = await this.claimRepository.get();
            // claims = claims.filter(c => c.user._id.equals(new ObjectID(user._id)));
            res.send(JSON.stringify(claims));
        }
    }
}

