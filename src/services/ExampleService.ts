import { ExampleEntity } from '../models/exampleEntity';
import { Service } from './service'
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
    public async exampleQuery(id: number): Promise<any> {
        
        const client = await this.pool.connect()
        try {
            const res = await client.query('SELECT * FROM users WHERE id = $1', [id])
            return res.rows[0];
        } catch (e) {
            console.log(e.stack)
        } finally {
          client.release()
        }
        return null
    }
}
  