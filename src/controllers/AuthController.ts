import { Request, Response } from 'express';
import { NotFound } from '../errors/NotFound';
import { ResourceExists } from '../errors/ResourceExists';
import { Unauthorized } from '../errors/Unauthorized';
import { User } from '../models/user';
import { AuthService } from '../services/AuthService';

const service = new AuthService();

export class AuthController {

    public static async signup(req: Request, res: Response) {
        const { username, password } = req.body;
        const isExists: boolean = await service.isUserExists(username);
        const user = new User(null, username, password);

        if (!isExists) {
            const success: boolean = await service.save(user);
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
        const isExits: boolean = await service.isUserExists(username);

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
}
