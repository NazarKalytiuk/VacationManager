import { Request, Response } from 'Express';
import { ApplicationDbContext } from '../domain';
import { Db } from 'mongodb';
let deserializeUser = async (req: Request, res: Response, next: Function) => {
    let db: Db = ApplicationDbContext.getApplicationDbContext().db;
    let token = req.headers.authorization;
    let user = await db.collection('Users').findOne({ accessToken: token });
    req.user = user;
    next();
}
export { deserializeUser };