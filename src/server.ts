import * as express from 'express';
import * as bodyParser from "body-parser";
import * as path from "path";
import * as passport from 'passport';
import { Request } from 'express';

import { passportConfig } from "./config";
import { User } from "./models";
import { deserializeUser } from "./middleware";
import { ClaimsController, AccountController, UserController, VacationController } from './controllers'

export class Server {
    public app: express.Application;
    constructor() {
        this.app = express()
        this.config();
        this.routes();
    }
    config() {
        this.app.use(function (req, res, next) {
            res.header("Access-Control-Allow-Origin", "*");
            res.header("Authorization", "*");
            res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
            next();
        });
        this.app.use(express.static(path.join(__dirname, "public")));
        this.app.use(bodyParser.json());
        this.app.use(bodyParser.urlencoded({ extended: true }));
        passportConfig
        passport.serializeUser(function (user, done) {
            done(null, user);
        });

        passport.deserializeUser(function (user, done) {
            done(null, user);
        });
        this.app.use(passport.initialize());
        this.app.use(passport.session());
        this.app.use(deserializeUser);
    }
    routes() {
        new AccountController(this.app);
        new VacationController(this.app);
        new ClaimsController(this.app);
        new UserController(this.app);
    }
}