import { Entity } from '../models/entity';
import { ExampleEntity } from '../models/exampleEntity';
import { Service } from './service'


export class ExampleService extends Service {


    public find(): ExampleEntity[] {
        let arr: ExampleEntity[] = [
            new ExampleEntity(1, "Fatih", true),
            new ExampleEntity(2, "Gokcan", true),
            new ExampleEntity(3, "Onur", false)         
        ]
        return arr
    }

    public findOne(id: number): ExampleEntity {
        return new ExampleEntity(id, "Fatih", true)
    }

}
  