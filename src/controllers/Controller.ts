import { Request, Response } from 'express'
import { ExampleService } from '../services/ExampleService'
import { EntityNotFoundError } from '../errors/EntityNotFound'
import { ExampleEntity } from '../models/ExampleEntity'

const service = new ExampleService()

export class Controller {

    public static sayHello(req: Request, res: Response) {
        res.send('Hello World')
    }
    
    public static getEntities(req: Request, res: Response) {
        let r: ExampleEntity[] =  service.find()
        res.send(r)
    }
    
    public static getEntity(req: Request, res: Response) {
        let r: ExampleEntity = service.findOne(req.params.id)        
        res.send(r)
    }

    public static async exampleQuery(req:Request, res:Response) {
        let { id } = req.params 
        let item: ExampleEntity = await service.exampleQuery(id);
        res.send(item)
    }

    
}
