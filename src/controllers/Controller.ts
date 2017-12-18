import { Request, Response } from 'express';
import { NotFound } from '../errors/NotFound';

export class Controller {
  public static sayHello(req: Request, res: Response) {
    res.send('Hello World!');
  }
}
