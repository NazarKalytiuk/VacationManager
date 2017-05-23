import * as express from 'Express';
import { Request, Response } from 'express'
import * as passport from 'passport';
import { Db, ObjectID } from 'mongodb';

import { User, Vacation } from "../models";
import { passportConfig } from "../config";
import { ApplicationDbContext } from '../domain';

export class VacationController {
    private db: Db;
    constructor(app: express.Application) {
        this.db = ApplicationDbContext.getApplicationDbContext().db;
        app.get('/vacations', this.vacations);
        app.delete('/vacation/:id', this.deleteVacation);
    };
    private get vacations() {
        return async (req: Request, res: Response) => {
            let user = req.user;
            if (!user) {
                res.sendStatus(500);
            } else if (!user.vacations) {
                res.sendStatus(404);
            }
            else {
                res.end(JSON.stringify(user.vacations));
            }

        }
    }
    private get deleteVacation() {
        return async (req: Request, res: Response) => {
            let vacations: Array<Vacation> = req.user.vacations;
            let newVacations = vacations.filter(c => {
                return c._id != req.params.id;
            })
            let user = await this.db.collection('Users').findOne({ _id: new ObjectID(req.user._id) });
            user.vacations = newVacations;
            await this.db.collection('Users').updateOne({ _id: new ObjectID(req.user._id) }, user);
            res.sendStatus(200);
        }
    }
    private get getAll() {
        return async (req: Request, res: Response) => {

        }
    }
}

