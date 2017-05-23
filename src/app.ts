import * as http from 'http';
import * as express from 'express';
import * as mongodb from 'mongodb';
import { Db } from 'mongodb';

import { User } from './models';
import { Server } from './server';
import { ApplicationDbContext } from './domain';


(async () => {
    let db: Db = await ApplicationDbContext.getApplicationDbContext().connect();
    // await db.collection('Users').deleteMany({});
    await db.dropDatabase();

    let app = new Server().app;
    let httpServer = http.createServer(app);
    httpServer.listen(3000);
})();
