import { Client, Pool } from 'pg';
import { ExampleEntity } from '../models/exampleEntity';
import { User} from '../models/user';
import { Service } from './service';

export class ExampleService extends Service {

    constructor() {
        super();
    }
    public find(): ExampleEntity[] {
        const arr: ExampleEntity[] = [
            new ExampleEntity(1, 'Fatih', 'jj', true),
            new ExampleEntity(2, 'Gokcan', 'kk', true),
            new ExampleEntity(3, 'Onur', 'kkkk', false),
        ];
        return arr;
    }

    public findOne(id: number): ExampleEntity {
        return new ExampleEntity(id, 'Fatih', 'mffk', true);
    }
    public async exampleQuery(id: number): Promise<ExampleEntity> {
            const client = await this.pool.connect();
            try {
              const res = await client.query('SELECT * FROM users WHERE id = $1', [id]);
              return res.rows[0];
            } catch (e) {
                // tslint:disable-next-line:no-console
                console.log(e.stack);
            } finally {
              client.release();
            }
            return null;
    }
}
