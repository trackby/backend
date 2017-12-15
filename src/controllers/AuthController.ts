import { Request, Response } from 'express';
import { NotFound } from '../errors/NotFound';
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
                res.json({
                    error: false,
                    message: 'User has been successfully created!',
                    user_id: user.id,
                });
            }
        } else {
            res.json({
                error: true,
                errorType: 'UNX',
                message: 'Username exits',
            });
        }
    }
}
