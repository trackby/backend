import { Request, Response } from 'express';
import { NextFunction } from 'express-serve-static-core';
import { BadRequest } from '../errors/BadRequest';
import { NotFound } from '../errors/NotFound';
import { ResourceExists } from '../errors/ResourceExists';
import { ServerError } from '../errors/ServerError';
import { Unauthorized } from '../errors/Unauthorized';
import { User } from '../models/user';
import { AuthService } from '../services/AuthService';

const service = new AuthService();

export class AuthController {

    public static async signup(req: Request, res: Response) {
        const { username, password, email, age } = req.body;
        let isExists: boolean = false;

        if (!username || !password || !email || !age) {
            return res.status(400).send(new BadRequest());
        }
        try {
            isExists = await service.isUserExists(username, email);
        } catch (e) {
            // tslint:disable-next-line:no-console
            console.log(e);
            return res.status(500).send(new ServerError());
        }

        if (!isExists) {
            const user = new User(username, password, email, age);
            let success: boolean = false;
            try {
                success = await service.save(user);
            } catch (e) {
                return res.status(400).send(new BadRequest());
            }
            if (success) {
                const userid = {user_id: user.id};
                return res.status(200).send(userid);
            }
        } else {
            return res.status(409).send(new ResourceExists());
        }
    }

    public static async authenticate(req: Request, res: Response) {
        const { username, password } = req.body;
        let isExits: boolean = false;

        if (!username || !password) {
            return res.sendStatus(400).send(new BadRequest());
        }
        try {
            isExits = await service.isUserExists(username);
        } catch (e) {
            // tslint:disable-next-line:no-console
            console.log(e);
            return res.status(500).send(new ServerError());
        }
        if (isExits) {
            const isMatched: boolean = await service.comparePass(password, username);
            if (isMatched) {
                const jwt = service.signJWT(username);
                return res.status(200).json({token: jwt, expiresIn: '1 day'});
            } else {
                return res.status(401).send(new Unauthorized());
            }
        } else {
            res.status(404).send(new NotFound());
        }
    }

    public static protect(req: Request, res: Response, next: NextFunction) {
       /* All resources are accessible via GET.
        * This rule is subject to change in future, regarding to application logic.
        */
        if (req.method === 'GET' ) {
            return next();
        }
        const token = req.body.token || req.query.token || req.headers['x-access-token'];
        const isVerified: boolean = service.verifyJWT(token);

        if (isVerified) {
            next();
        } else {
            return res.status(403).send(new Unauthorized());
        }
      }
    }
