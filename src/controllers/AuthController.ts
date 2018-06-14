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
    const { username, password, email } = req.body;
    let isExists: boolean = false;

    if (!username || !password || !email) {
      return res.status(400).send(new BadRequest());
    }
    try {
      isExists = await service.isUserExists(username, email);
    } catch (e) {
      return res.status(500).send(new ServerError());
    }

    if (!isExists) {
      const user = new User(username, password, email);
      let success: boolean = false;
      try {
        success = await service.save(user);
      } catch (e) {
        return res.status(400).send(new BadRequest());
      }
      if (success) {
        const userid = { user_id: user.id };
        return res.status(200).send(userid);
      }
    } else {
      return res.status(409).send(new ResourceExists());
    }
  }

  public static async authenticate(req: Request, res: Response) {
    const { username, password } = req.body;
    let isExists: any = false;

    if (!username || !password) {
      return res.sendStatus(400).send(new BadRequest());
    }
    try {
      isExists = await service.isUserExists(username);
    } catch (e) {
      return res.status(500).send(new ServerError());
    }
    if (isExists) {
      const isMatched: boolean = await service.comparePass(password, username);
      if (isMatched) {
        const id = isExists.id;
        const flag = isExists.role;
        const jwt = service.signJWT(id, flag);
        return res.status(200).json({ token: jwt, expiresIn: '1 day' });
      } else {
        return res.status(401).send(new Unauthorized());
      }
    } else {
      res.status(404).send(new NotFound());
    }
  }

  public static protect(req: Request, res: Response, next: NextFunction) {
     if (process.env.NODE_ENV === 'test') {
      req.body.user.uid = 1; // mock data
      return next();
    }
     if (req.method === 'OPTIONS') {
      next();
    } else {
      const token = req.body.token || req.query.token || req.headers['x-access-token'];
      const decoded: any = service.verifyJWT(token);

      if (decoded) {
        res.locals.user = {};
        res.locals.user.uid = decoded.id;
        res.locals.user.role = decoded.role;
        next();
      } else {
        return res.status(403).send(new Unauthorized());
      }
    }
  }

  // Role-Permission middleware. req.body.user.role should be used in other methods from now on.
  public static role(role: any) {
    return (req: Request, res: Response, next: NextFunction) => {
      switch (role) {
        case 'ADMIN': {
          if (res.locals.user && res.locals.user.role === 'ADMIN') {
            next();
          } else {
            return res.status(403).send(new Unauthorized());
          }
          break;
        }
        case 'REGISTERED_USER': {
          if (res.locals.user && res.locals.user.role === 'REGISTERED_USER') {
            next();
          } else {
            return res.status(403).send(new Unauthorized());
          }
          break;
        }
        default: {
           console.log('Not an expected argument.');
           break;
        }
     }
    };
   }
}
