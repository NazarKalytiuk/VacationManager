import * as express from 'Express';
import { Request, Response } from 'express'
import * as passport from 'passport';
import { Db, ObjectID } from 'mongodb';

import { passportConfig } from "../config";
import { Vacation, User, Claim } from '../models';
import { ClaimRepository, UserRepository, ApplicationDbContext } from "./../domain";

export class ClaimsController {
    private db: Db;
    private userRepository: UserRepository;
    private claimRepository: ClaimRepository;
    constructor(app: express.Application) {
        this.db = ApplicationDbContext.getApplicationDbContext().db;
        this.userRepository = new UserRepository();
        this.claimRepository = new ClaimRepository();

        app.get('/claim/all', this.getAllClaims);
        app.post('/claim', this.createClaim);
        app.post('/claim/approve', this.approveClaim);
        app.post('/claim/decline', this.declineClaim);

    };
    private get getAllClaims() {
        return async (req: Request, res: Response) => {
            let claims = await this.db.collection('Claims').find({}).toArray();
            res.send(JSON.stringify(claims));
        }
    }
    private get createClaim() {
        return async (req: Request, res: Response) => {
            console.log(req.user.role);
            let user: User = req.user;
            let vacation: Vacation = req.body.vacation;
            if (new Date(vacation.startDate) < new Date()) {
                res.sendStatus(500);
                return;
            }
            let claim = new Claim();
            claim.user = user;
            claim.vacation = vacation;
            // await this.claimRepository.add(claim);
            await this.db.collection('Claims').insertOne(claim);
            res.send(JSON.stringify(claim));
        }
    }
    private get approveClaim() {
        return async (req: Request, res: Response) => {
            if(req.user.role != 1) {
                res.sendStatus(403)
            }
            let user: User = req.body.user;
            user = await this.db.collection('Users').findOne({ _id: new ObjectID(user._id) });
            let vacation: Vacation = req.body.vacation;
            vacation._id = new ObjectID();
            if (user.vacations == undefined) {
                user.vacations = new Array<any>();
            }

            //// check max 25 vacations in year and transfer from previous year
            let sum = 0;
            user.vacations.forEach(element => {
                sum += element.count;
            });
            let lastYearVacations = user.vacations.filter(c => {
                return new Date(c.startDate).getFullYear() === (new Date().getFullYear() - 1);
            })
            let lastYearSum = 0;
            lastYearVacations.forEach(element => {
                lastYearSum += element.count;
            });
            let daysLeft = 0;
            if (lastYearSum < 20) {
                daysLeft = 20 - lastYearSum + 20;
                if (daysLeft >= 25) {
                    daysLeft = 25;
                }
            }
            if (sum + vacation.count > daysLeft) {
                res.sendStatus(500);
                res.end();
                return;
            }

            user.vacations.push(vacation);

            //// check max 10 vacatios in months
            let slovar = (new Array<number>(12)).fill(0);
            user.vacations.forEach((element: Vacation) => {
                slovar[new Date(element.startDate).getMonth()] += element.count;
            });
            let isValid = slovar.every(c => c <= 10)
            if (!isValid) {
                res.sendStatus(500);
                res.end();
                return;
            }

            await this.db.collection('Users').updateOne({ 'name': user.name }, user);
            await this.db.collection('Claims').deleteOne({ 'user.name': user.name });
            res.send(JSON.stringify('200'))
        }
    }
    private get declineClaim() {
        return async (req: Request, res: Response) => {
            if(req.user.role != 1) {
                res.sendStatus(403)
            }
            let user: User = req.body.user;
            user = await this.db.collection('Users').findOne({ _id: new ObjectID(user._id) });
            // user = 
            let vacation: Vacation = req.body.vacation;
            await this.db.collection('Claims').deleteOne({ 'user.name': user.name });
            res.send(JSON.stringify('200'))
        }
    }

}

