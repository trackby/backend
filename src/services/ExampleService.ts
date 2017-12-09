import { Entity } from '../models/entity';
import { ExampleEntity } from '../models/exampleEntity';
import { Service } from './service'
import { Pool, Client } from 'pg';

export class ExampleService extends Service {

    constructor() {
        super()
    }

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
    public async exampleQuery(id: number): Promise<ExampleEntity> {
        
            const client = await this.pool.connect()
            try {
              const res = await client.query('SELECT * FROM users WHERE id = $1', [id])
              return res.rows[0];
            } catch (e) {
                console.log(e.stack)
            } finally {
              client.release()
            }
            return null;
    }

}
  