import { Request, Response } from 'express';
import { NotFound } from '../errors/NotFound';
import { ExampleEntity } from '../models/ExampleEntity';
import { ExampleService } from '../services/ExampleService';

const service = new ExampleService();

export class Controller {

    public static sayHello(req: Request, res: Response) {
        res.send('Hello World!');
    }

    public static getEntities(req: Request, res: Response) {
        const r: ExampleEntity[] =  service.find();
        res.send(r);
    }

    public static getEntity(req: Request, res: Response) {
        const r: ExampleEntity = service.findOne(req.params.id);
        res.send(r);
    }

    public static async exampleQuery(req: Request, res: Response) {
        const { id } = req.params;
        const item: ExampleEntity = await service.exampleQuery(id);
        res.send(item);
    }

}
