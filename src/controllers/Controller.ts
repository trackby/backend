import { Request, Response } from 'express'
import { Service } from '../services/Service'
import { EntityNotFoundError } from '../errors/EntityNotFound'


const service = new Service()

export class Controller {

    public static sayHello(req: Request, res: Response) {
        res.send('Hello World')
    }
    
    public static getEntities(req: Request, res: Response) {
        res.send(service.find())
    }
    
    public static getEntity(req: Request, res: Response) {
        res.send(service.findOne(1))
    }
    
}
