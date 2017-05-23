import * as express from 'Express';
import { Request, Response } from 'express'
import * as passport from 'passport';
import { User } from "../models/index";
import { passportConfig } from "../config/auth.config";
import { Db } from 'mongodb';
import { ApplicationDbContext } from '../domain/applicationDbContext';

export class AccountController {
    private db: Db;
    private get getToken() {
        return (req, res : Response) => {
            res.setHeader('Authorization', this.user.accessToken);
            res.send(JSON.stringify(this.user.accessToken));
        }
    }
    constructor(app: express.Application) {
        this.db = ApplicationDbContext.getApplicationDbContext().db;

        app.get('/getToken', this.getToken);
        app.get('/account', this.registerExternal);
        app.get('/account/user', this.getUserIfo);
        app.get('/auth/google/callback', this.authenticate, this.authenticateCallback);
        app.get('/usersList', this.users);
    };
    private user : User;
    private get users() {
        return async (req: Request, res) => {
            let users: Array<User> = await this.db.collection('Users').find().toArray();
            res.send(users);
            res.end();
        }
    }
    private get registerExternal() {
        return passport.authenticate('google', { scope: ['https://www.googleapis.com/auth/plus.profile.emails.read'] })
    }
    private get authenticate() {
        return passport.authenticate('google');
    }
    private get authenticateCallback() {
        return async (req: Request, res) => {
            console.log('token from callback', req.user.accessToken);
            console.log('token from callback string ', req.user.accessToken.toString());
            res.setHeader('Content-Type', 'application/json');
            this.user = req.user;
            res.redirect('http://localhost:8080/auth/google/callback')
        }
    }
    private get getUserIfo() {
        return async (req, res) => {
            res.send(JSON.stringify(req.user));
        }
    }
}

